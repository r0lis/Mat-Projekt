/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as admin from 'firebase-admin';
const firebaseAdminConfig = {
  "type": "service_account",
  "project_id": "mat-project-8e132",
  "private_key_id": "54130eef981d049c07687f3f9c0711a3b22b86ba",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCsts4dfKIKgr/n\nVQ/zYkbNDy6IkevnAxFxrtRSRlnk/le4dC3KHMVLvFCABqcq32XDzpe4Nf9D2vSE\n4JBsJzjxoWjeJxzKpNt+dYE1s6Hhnn1RtQ5EQtmpBf7nfj/y14qZuqN4FJpHcbkD\n5PMsPnQM7MxzjzPMr38p9gEA3bYMU9AiuOuNxNfNCrGtZ+/k/lu7n8gS2mrWZM9X\nhQn48Y+Gwi74oxMnniBEXAUpERrnrbfzF9EmEpSeUcmpH45NebZt9SPnCb24qn9Y\nfjqVC8oHnrfgU7Ql/8o7GCf1ApOwvdUHkLm95LwzdB+qfQ3HVhDEoAkI56eM3Ukm\n/NDKb763AgMBAAECggEABZ3j6EyVBN98qy+QF1VGW5I9uRF5yQD61vLqRiSyKE+a\nZBrCVHTVq7r1KTy0jTquCto6Nkwdpl2Sa/HVPVctmgB3fxk2U/0pg2k1D9CGmEys\nFnV1ADfmVgHAAocPprxnIWaGI2t6gVrlVLpkEbfHbi/GdFzSjYdvJlrkOUMWK29o\nNQD95XTnbfwVnx9BU1PS0wgfSI3BNwTSDKs98dCR/y5X3X8vO99M9IPNuDeh7p4k\nOZM+iapxXEprCWXmEM31RbowOaosvXxQxLdMMYF29kXcjgPsQo+936ngOuAbS6ge\ni6Dd2bdlsMKFP2dj6lCukb8xi2IRBxUE/LxGoBByMQKBgQDmb3c8gLH5ysS1T20M\nxebfceRwovNpBHeM2hu56Y5T9yxKsIhn0JjPofxuycaRfPtQArUEiIgL1yoyIz4z\nbcUGQpzgYYOYzoFG0dALJwwG4rj/AOLp+n1vBVK7MejkfLje+ky++Y72xz7mQepF\noVlwa2uFWTBn5BQ4KDNfxJbyhwKBgQC/4ALpdPkCGsl8hDcbXHPMnSt0YCaZd72X\nEFMNzFNvrCHFgOZ85Zeu5fRqx7l04hgHngDL24KzHUFaaCK81r4PU2VKNKB8Fib6\n7XdpdOL8mjXY4teuySWyHLu+kOBF7WDWIbUkVzF72IB2izjKLXt4GDpH65RduurD\nHlJExJFuUQKBgQC0c0tjVMCKhO//r8AMxZkjF3Q1hFWqwnXAFjiqIKx1MlU78/wN\nl/tidU5Rj67w1XeT01rfvu8Snp8Lfi/CZE5qtZVV3OcJrYTs6XbKlPxFFBycjJwl\ncCPz4a5EqzPeYZEAA/A/iPwcYjDubWXAuzZn46biWNKgOKpgw5Jfh3pRVwKBgQCm\n+YKPN0QbGMSOn2B1Zxc+0Oen9qSgmRtcAtDECTPy0pDxFyN9PS+q/GKfKf+yP685\nsb5vqS8sQCFHU6gnPZlYLPLQiMvAMGbrpwtrslR2Dp0diQq5CELNpUOcqucA83p5\n3guM/HQLmnTwtGdPShVQhYTyYYhTqP3znsdpIMaOgQKBgF1xPiwE9atcIO3Ov6gi\nX0W081hGmzFG/Wgsct1uDUHnQFhXAfWOeKvyJaRvk21ev82YchA/OOFxn0HP6UVe\nuGcovi72TrenZZSQTO0mHelFmOS4TEKlkqglhpKnrbf3OUocPVCdbdMy+bi46+G2\nLctB08f8OQdx8hM9QGMGLMGo\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-1k93i@mat-project-8e132.iam.gserviceaccount.com",
  "client_id": "111091392667622908908",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-1k93i%40mat-project-8e132.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};
if (admin.apps.length === 0) {
  // Initialize Firebase
  admin.initializeApp({
    // @ts-ignore
    credential: admin.credential.cert(firebaseAdminConfig),
  });
}

export const {firestore, auth: adminAuth} = admin;
