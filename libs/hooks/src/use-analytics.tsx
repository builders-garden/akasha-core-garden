import * as React from 'react';
import {
  AnalyticsEventData,
  AnalyticsEventTypes,
  IRootComponentProps,
} from '@akashaorg/typings/lib/ui';
import { BehaviorSubject } from 'rxjs';

/**
 * @internal
 */
export const COOKIE_CONSENT_NAME = 'ewa-cookie-consent';

/**
 * @internal
 */
export enum CookieConsentTypes {
  ESSENTIAL = 'ESSENTIAL',
  ALL = 'ALL',
}

const AnalyticsContext = React.createContext(null);

const AnalyticsProvider = ({
  uiEvents,
  children,
}: {
  uiEvents: IRootComponentProps['uiEvents'];
  children?: React.ReactNode;
}) => {
  return <AnalyticsContext.Provider value={uiEvents}>{children}</AnalyticsContext.Provider>;
};

/**
 * @internal
 */
export interface UseAnalyticsActions {
  /* Track a custom event */
  trackEvent: (eventData: AnalyticsEventData['data']) => void;
}

/**
 * Hook to handle analytics
 * @example useAnalytics hook
 * ```typescript
 * const [analyticsActions] = useAnalytics();
 *
 * analyticsActions.trackEvent({
 category: 'some-category',
 action: 'some-action',
 });
 * ```
 */
const useAnalytics = (): [UseAnalyticsActions] => {
  const analyticsBus = React.useContext<BehaviorSubject<AnalyticsEventData>>(AnalyticsContext);

  if (!analyticsBus) {
    throw new Error('useAnalytics must be used within a AnalyticsProvider!');
  }

  const actions: UseAnalyticsActions = {
    trackEvent(eventData) {
      analyticsBus.next({
        event: AnalyticsEventTypes.TRACK_EVENT,
        data: eventData,
      });
    },
  };

  return [actions];
};

export { useAnalytics, AnalyticsProvider };
