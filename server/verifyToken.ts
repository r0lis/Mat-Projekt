// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable unicorn/catch-error-name */
import { adminAuth } from './firebase-admin-config';

export const verifyToken = async (token: string) => {
  try {
    const parts = token.split(' ');
    if (parts.length < 2) {
      console.error('invalid token format');
      return undefined;
    }
    const decoded = await adminAuth().verifyIdToken(parts[1]);
    const { email } = decoded;
    console.info('verified token for user', { email });
    return decoded;
  } catch (e) {
    console.warn('verified token failed', e);
    return undefined;
  }
};
