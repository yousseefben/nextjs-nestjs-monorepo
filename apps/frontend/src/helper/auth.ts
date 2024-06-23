export const isTokenExpired = (token) => {
  return !token || token.expiryTime < Date.now() / 1000;
};
