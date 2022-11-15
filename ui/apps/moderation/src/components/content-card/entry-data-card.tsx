import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import { ILocale } from '@akashaorg/design-system/lib/utils/time';
import {
  ModerationItemTypes,
  NavigateToParams,
  IEntryData,
  IProfileData,
} from '@akashaorg/typings/ui';
import { useEntryNavigation } from '@akashaorg/ui-awf-hooks';
import { IContentClickDetails } from '@akashaorg/design-system/lib/components/EntryCard/entry-box';
import { ITEM_TYPE_CONVERTER } from '../../services/constants';

const { Text, EntryCard, ProfileCard, MainAreaCardBox } = DS;

export interface IEntryDataCardProps {
  entryData: IEntryData | IProfileData;
  locale: ILocale;
  itemType: string;
  modalSlotId: string;
  navigateTo?: (args: NavigateToParams) => void;
}

const EntryDataCard: React.FC<IEntryDataCardProps> = props => {
  const { entryData, itemType, locale, modalSlotId } = props;

  const { t } = useTranslation('app-moderation-ewa');

  const handleEntryNavigate = useEntryNavigation(props.navigateTo);

  const handleContentClick = React.useCallback(
    (details: IContentClickDetails) => {
      const translatedItemType = ITEM_TYPE_CONVERTER[itemType];
      if (translatedItemType >= 0) {
        handleEntryNavigate(details, translatedItemType);
      }
    },
    [handleEntryNavigate, itemType],
  );

  return (
    <MainAreaCardBox>
      {entryData ? (
        <>
          {/* for other contents (reply | comment, post) */}
          {itemType !== ModerationItemTypes.ACCOUNT && entryData && (
            <EntryCard
              modalSlotId={modalSlotId}
              showMore={false}
              entryData={entryData as IEntryData}
              repliesLabel={t('Replies')}
              locale={locale}
              style={{ height: 'auto' }}
              contentClickable={true}
              onClickAvatar={() => null}
              onContentClick={handleContentClick}
              disableReposting={true}
              isModerated={true}
              isRemoved={(entryData as IEntryData).isRemoved}
              removedByMeLabel={t('You deleted this post')}
              removedByAuthorLabel={t('This {{itemType}} was deleted by its author', { itemType })}
            />
          )}
          {itemType === ModerationItemTypes.ACCOUNT && (
            <ProfileCard
              modalSlotId={modalSlotId}
              showMore={false}
              flaggable={true}
              viewerIsOwner={false}
              profileData={entryData as IProfileData}
              followLabel={t('Follow')}
              unfollowLabel={t('Unfollow')}
              followingLabel={t('Following')}
              shareProfileLabel={t('Share Profile')}
              onEntryFlag={() => null}
              onUpdateClick={() => null}
              hideENSButton={true}
              handleShareClick={() => null}
            />
          )}
        </>
      ) : (
        <Text textAlign="center">Loading content...</Text>
      )}
    </MainAreaCardBox>
  );
};

export default EntryDataCard;
