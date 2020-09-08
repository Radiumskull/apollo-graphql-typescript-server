import * as admin from 'firebase-admin';
import serviceAccount from './firebase-config.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as object),
});

export default admin;
