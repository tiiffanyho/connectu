const STORAGE_KEY = 'connectu_user';

const isStorageAvailable = () => {
  try {
    const testKey = '__connectu_test__';
    sessionStorage.setItem(testKey, '1');
    sessionStorage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};

const storageSupported = typeof window !== 'undefined' && typeof sessionStorage !== 'undefined' && isStorageAvailable();

export const loadUserFromSession = () => {
  if (!storageSupported) {
    return null;
  }

  try {
    const value = sessionStorage.getItem(STORAGE_KEY);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    return null;
  }
};

export const saveUserToSession = (payload) => {
  if (!storageSupported) {
    return false;
  }

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch (error) {
    return false;
  }
};