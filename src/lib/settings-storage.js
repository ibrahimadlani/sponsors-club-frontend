const STORAGE_PREFIX = "sc-settings";

const resolveKey = (scope, userId) => {
  const sanitizedScope = String(scope || "default").trim() || "default";
  const owner = userId ? String(userId).trim() : "anonymous";
  return `${STORAGE_PREFIX}:${owner}:${sanitizedScope}`;
};

export const loadSettings = (scope, fallback = {}, userId) => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(resolveKey(scope, userId));
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      return { ...fallback, ...parsed };
    }
    return fallback;
  } catch (error) {
    console.warn(`Unable to read settings for scope "${scope}"`, error);
    return fallback;
  }
};

export const persistSettings = (scope, values, userId) => {
  if (typeof window === "undefined") return;
  try {
    const payload = values && typeof values === "object" ? values : {};
    localStorage.setItem(resolveKey(scope, userId), JSON.stringify(payload));
  } catch (error) {
    console.warn(`Unable to persist settings for scope "${scope}"`, error);
  }
};

export const clearSettings = (scope, userId) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(resolveKey(scope, userId));
  } catch (error) {
    console.warn(`Unable to clear settings for scope "${scope}"`, error);
  }
};
