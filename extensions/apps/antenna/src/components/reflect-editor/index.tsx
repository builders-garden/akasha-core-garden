import React, { useRef, useState } from 'react';
import ReflectionEditor from '@akashaorg/design-system-components/lib/components/ReflectionEditor';
import getSDK from '@akashaorg/core-sdk';
import {
  transformSource,
  encodeSlateToBase64,
  useAnalytics,
  decodeb64SlateContent,
  useRootComponentProps,
  useMentions,
  useAkashaStore,
} from '@akashaorg/ui-awf-hooks';
import { useCreateReflectMutation } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { useTranslation } from 'react-i18next';
import {
  AnalyticsCategories,
  IPublishData,
  NotificationTypes,
  NotificationEvents,
  ReflectionData,
  CustomElement,
} from '@akashaorg/typings/lib/ui';
import {
  usePendingReflections,
  PENDING_REFLECTION_PREFIX,
} from '@akashaorg/ui-awf-hooks/lib/use-pending-reflections';
import { getEditorValueForTest } from './get-editor-value-for-test';
import { useCloseActions } from '@akashaorg/design-system-core/lib/utils';
import { isEditorEmpty } from '@akashaorg/design-system-components/lib/components/Editor/helpers';

export type ReflectEditorProps = {
  beamId: string;
  reflectToId: string;
  showEditor: boolean;
  setShowEditor: (showEditor: boolean) => void;
};

const ReflectEditor: React.FC<ReflectEditorProps> = props => {
  const { beamId, reflectToId, showEditor, setShowEditor } = props;
  const { t } = useTranslation('app-antenna');
  const { uiEvents } = useRootComponentProps();
  const [analyticsActions] = useAnalytics();
  const [editorState, setEditorState] = useState<CustomElement[] | null>(null);
  const [newContent, setNewContent] = useState<ReflectionData>(null);
  const uiEventsRef = React.useRef(uiEvents);
  const pendingReflectionIdRef = useRef(null);
  const wrapperRef = useCloseActions(() => {
    if (isEditorEmpty(editorState)) {
      setShowEditor(false);
    }
  });

  const sdk = getSDK();
  const isReflectOfReflection = reflectToId !== beamId;

  const [publishReflection] = useCreateReflectMutation({
    context: { source: sdk.services.gql.contextSources.composeDB },
    onCompleted: () => {
      analyticsActions.trackEvent({
        category: AnalyticsCategories.REFLECT,
        action: 'Reflect Published',
      });
    },
    onError: () => {
      handleError();
    },
  });
  const { addPendingReflection, removePendingReflection, updatePendingReflection } =
    usePendingReflections();

  const {
    data: { authenticatedDID, authenticatedProfile },
  } = useAkashaStore();

  const { setMentionQuery, mentions } = useMentions(authenticatedDID);
  const handleGetMentions = (query: string) => {
    setMentionQuery(query);
  };

  const showAlertNotification = React.useCallback((title: string) => {
    uiEventsRef.current.next({
      event: NotificationEvents.ShowNotification,
      data: {
        type: NotificationTypes.Info,
        title,
      },
    });
  }, []);

  /*
   * Currently jsdom doesn't support contenteditable and as a result slate editor can't be tested in jsdom.
   * This effect is a workaround to set the value of the editor during tests
   **/
  React.useEffect(() => {
    const editorValueForTest = getEditorValueForTest();
    if (editorValueForTest) {
      setEditorState(
        Array.isArray(editorValueForTest)
          ? editorValueForTest.map(value => ({
              type: 'paragraph',
              children: [
                {
                  text: value,
                },
              ],
            }))
          : [
              {
                type: 'paragraph',
                children: [
                  {
                    text: editorValueForTest,
                  },
                ],
              },
            ],
      );
    }
  }, []);

  const handleError = () => {
    setShowEditor(true);
    setEditorState(newContent.content.flatMap(item => decodeb64SlateContent(item.value)));
    showAlertNotification(`${t(`Something went wrong when publishing the reflection`)}.`);
    removePendingReflection(pendingReflectionIdRef.current);
  };

  const handlePublish = async (data: IPublishData) => {
    const reflection = isReflectOfReflection ? { reflection: reflectToId, isReply: true } : {};
    const content = {
      active: true,
      beamID: beamId,
      content: [
        {
          label: data.metadata.app,
          propertyType: 'slate-block',
          value: encodeSlateToBase64(data.slateContent),
        },
      ],
      createdAt: new Date().toISOString(),
      ...reflection,
    };
    setNewContent({ ...content, authorId: null, id: null });
    //Create unique id for pending reflection using randomUUID().
    pendingReflectionIdRef.current = `${PENDING_REFLECTION_PREFIX}-${crypto.randomUUID()}`;
    addPendingReflection({
      ...content,
      id: pendingReflectionIdRef.current,
      beam: {
        id: beamId,
      },
      author: {
        id: authenticatedDID,
      },
    });

    const response = await publishReflection({
      variables: {
        i: {
          content,
        },
      },
    });

    if (response.data?.createAkashaReflect) {
      updatePendingReflection(pendingReflectionIdRef.current, {
        ...response.data.createAkashaReflect.document,
        published: true,
      });
    }
  };

  return (
    <ReflectionEditor
      ref={wrapperRef}
      actionLabel={t('Reflect')}
      placeholderButtonLabel={t('Reflect')}
      placeholderLabel={t('My thoughts on this are...')}
      cancelButtonLabel={t('Cancel')}
      emojiPlaceholderLabel={t('Search')}
      disableActionLabel={t('Authenticating')}
      maxEncodedLengthErrLabel={t('Text block exceeds line limit, please review!')}
      noMentionsLabel={t('You are not following anyone with that name')}
      editorState={editorState}
      showEditor={showEditor}
      setShowEditor={setShowEditor}
      avatar={authenticatedProfile?.avatar}
      profileId={authenticatedDID}
      disablePublish={!authenticatedDID}
      mentions={mentions}
      getMentions={handleGetMentions}
      background={{ light: 'white', dark: 'grey2' }}
      onPublish={data => {
        if (!authenticatedDID) {
          return;
        }
        handlePublish(data);
      }}
      setEditorState={setEditorState}
      transformSource={transformSource}
      encodingFunction={encodeSlateToBase64}
    />
  );
};

export default ReflectEditor;
