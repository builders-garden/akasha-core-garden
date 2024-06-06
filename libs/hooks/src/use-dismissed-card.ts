import { useEffect, useState } from 'react';

interface IStorage {
  setItem(key: string, value: string): void;
  getItem(key: string): string;
  removeItem(key: string): void;
}

const LOCAL_STORAGE_KEY = 'dismissed-card-ids';

const writeToStorage = (storage: IStorage, key: string, value: string[]): void => {
  storage.setItem(key, JSON.stringify(value));
};

/**
 * Hook to manage the information cards displayed in the sidebar or inside
 * the apps which users can dismiss by clicking the close button.
 * @param id - string
 * @param statusStorage - IStorage (optional) to specify from which storage to retrieve the saved dismissed card IDs.
 * @example useDismissedCard hook
 * ```typescript
 * const [dismissed, dismissCard] = useDismissedCard('@akashaorg/ui-widget-sidebar_cta-card');
 * ```
 **/
export function useDismissedCard(id: string, statusStorage?: IStorage): [boolean, () => void] {
  const [dismissed, setDismissed] = useState<boolean>(true);

  const storage = statusStorage || window.localStorage;

  const dismissedIds = new Set<string>(JSON.parse(storage.getItem(LOCAL_STORAGE_KEY)));

  useEffect(() => {
    setDismissed(dismissedIds.has(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dismissed]);

  const dismissCard = () => {
    dismissedIds.add(id);

    writeToStorage(storage, LOCAL_STORAGE_KEY, [...dismissedIds]);

    setDismissed(true);
  };

  return [dismissed, dismissCard];
}
