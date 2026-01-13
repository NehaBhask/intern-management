export const generateRandomPassword = () =>
  Math.random().toString(36).slice(-8);

export const pick = (obj: any, keys: string[]) =>
  keys.reduce((acc, key) => {
    if (obj[key]) acc[key] = obj[key];
    return acc;
  }, {} as any);
