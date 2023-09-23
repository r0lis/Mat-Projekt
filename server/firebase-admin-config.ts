// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/ban-ts-comment */
// eslint-disable-next-line import/newline-after-import
import * as admin from 'firebase-admin';
const firebaseAdminConfig = {
  type: 'service_account',
  project_id: 'travelhub-fe427',
  private_key_id: '1dfc792f23315eeac35a39e2277b0c274189b516',
  private_key:
    '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDeigCsaQim/0wN\niPKY+1r1S8Ua52Q6FKid9Ige3zcwloWwkzo6E1EMNxfDTVoFa0EZl4AOCAhkThZy\nOzmCc2QnXj7JS3jaYt/6vdvumOjlZXSkfvtrZ0t0qqKEZGYiZ2/0B3JQZKRRrgZe\nECNbXsrU8Vf1R7XD6qn3yyKtFkVnbsVZZrMUVYusEGk+GRRSnSktjMNZ/bmiBxGx\n918jnc3r+CyikExc4yYMfqDripfW1/QeVHHTXAuPa3Up5+U4PProbTBlf+Q9oZdh\nPTCSyJ34DZd7Elhl/5qJpSJ/fArrIIccLShU73NJWi1ABMUiim59ZkcUzIf8LSKM\nz6SI6X2xAgMBAAECgf8Zn/b5dBOhPWtuOdEv+PkyZxfb6vWfjfkUNypqTV/3Q3Qh\nfNKFhGX9ROBWOKg7RWxP3yIXWiNadJhNmisxop12cJtmDNtuYHnZWnKq2j6S8/pk\nLlFKqJpKe8rWwcP12Sr0whNGT/dkOLv9ZrzuThJEtbIzgRmDST9qgMHsvRMUUCgj\nTXTxW8eiUFxAR4H9fw2OqZBWOS0SOnCtPiAlDkUihcGJp0Gibl25CEPLPYF1dIKQ\nrz/CyWf4MRYAQjQ2X+UapZFMyn8hTKfU0dLkc2PCLYaO8QTVi8MltaOYm6LbrWeP\nJBqWdzdZyIbdkTxN3avCPPHdY/PH1phzt3zuwAECgYEA79mcNpYs/27nwqLzEYI+\n/uvY50x64oIsKt6aU8xIW0m0Jo3bYUWZD87FHa9vXJWFLNwhfm/RTaTkXA0JTzvO\n1AMEPQrlz9SI1uSOGKF90Kgak84mpkABAWu3aFlbwyTe8NBoCGgFXHk2TiVlQSSX\nctBgE6ax/uSjAkG8C48EC7ECgYEA7YX/F2+GtXW8tha52fW2hYso/aoq8OKS37iq\np7GC7lXodtUdyUCEOqmmvcJK2Q3vXh1k5PK2OTyOi7vcDPyxLzMEuOn9QykrOhC4\n4o/B7vzciPyv7v/cuNrGbRxt7sVr3FwtPjjFRzo+nE0oE9VsBny6ncUOh/voRo0V\noO4DEgECgYBYNhlMviiofPqBy/pHezZ9/PGWB7u+KI/j6GCr5xrJcC7wawW/HaCw\nfqRiSY5UZ61GFWPAI5G/06Ak9qpw2Jc1xDI/3Q0uRYVaO07DYklqfxjfOVdfl3SH\nOD2JBCxKdfoEaTGJvfAS1YWSchBuR+3nTRm4wHsAOsh04QYu3hdn0QKBgQCytIpE\ne6iChl7BMUALeQ8mUpk4oPtF2XJf2HStTqUP5JrOLXIHpP7XlCTbyH6/5/gce0kZ\n6HKphaJKB8F8E/LLbDs1VPczvJnFSieQblCfGqhieJt12hObER8RoL4lU2vfk4qG\nsffbqzrIJlTs9zobd2SAp25TaXhM/IE1X134AQKBgQCzif/vfoQKdN8TYp0E5NPT\nQ/Wy0mtbaoRpZZ84fpOtgTAvEApVu7LeAqetaZAFRj+Xyxcx709THFMfDmZuUIM2\nwm1KbD2NILJkU+pj8uYuU6L+1x8fggrFtDLynTjc0ld9nQSzJRO/KzOwiCUbToWI\nuqHoMaJTC2uSJR02kSWBpA==\n-----END PRIVATE KEY-----\n',
  client_email:
    'firebase-adminsdk-uibbt@travelhub-fe427.iam.gserviceaccount.com',
  client_id: '111323525455910098158',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-uibbt%40travelhub-fe427.iam.gserviceaccount.com',
};
if (admin.apps.length === 0) {
  // Initialize Firebase
  admin.initializeApp({
    // @ts-ignore
    credential: admin.credential.cert(firebaseAdminConfig),
  });
}

// eslint-disable-next-line prettier/prettier
export const {firestore, auth: adminAuth} = admin;
