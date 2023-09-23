import createCache from '@emotion/cache';

const createEmotionCache = () => {
  return createCache({ key: 'css', prepend: true });
};

// eslint-disable-next-line import/no-default-export
export default createEmotionCache;
