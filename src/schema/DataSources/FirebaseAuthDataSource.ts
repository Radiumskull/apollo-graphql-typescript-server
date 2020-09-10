import { DataSource } from 'apollo-datasource';
import { InMemoryLRUCache } from 'apollo-server-caching';
import { ApolloError, ValidationError } from 'apollo-server';
import admin from '../../config/firebase';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class FirebaseAuthDataStore extends DataSource {
  context: any;
  cache: any;
  auth: any;

  initialize({ context = {}, cache = {} } = {}) {
    this.context = context;
    this.cache = cache || new InMemoryLRUCache();
  }

  AuthTokenMap(post: any) {
    return {
      accessToken: post.accessToken,
      refreshToken: post.refreshToken,
    };
  }

  async createUser(displayName: string, email: string, password: string) {
    const salt = bcrypt.genSaltSync(16);
    const hash = await bcrypt.hash(password, salt);
    try {
      const user = await admin
        .firestore()
        .collection('users')
        .where('email', '==', email)
        .get();
      if (user !== null) {
        return new ValidationError('Email Already Exists');
      }
      const response = await admin
        .firestore()
        .collection('users')
        .add({
          displayName: displayName,
          salt: salt,
          hash: hash,
          email: email,
          dateOfBirth: admin.database.ServerValue.TIMESTAMP,
        });
      const jwtToken = jwt.sign(
        {
          displayName: displayName,
          userId: response.id,
          type: 'access_token',
        },
        'welovegito',
      );
      const refreshToken = jwt.sign(
        {
          userId: response.id,
          type: 'refresh_token',
        },
        'welovegito',
      );
      return this.AuthTokenMap({
        accessToken: jwtToken,
        refreshToken: refreshToken,
      });
    } catch (err) {
      return new ApolloError(err);
    }
  }

  async checkCredentials(email: string, password: string) {
    try {
      const user: any = await admin
        .firestore()
        .collection('users')
        .where('email', '==', email)
        .get();
      if (!user) {
        return new ValidationError('No User Found');
      }

      if (
        user.data().hash !==
        (await bcrypt.hash(password, user.data().salt))
      ) {
        return new ValidationError('Check Credentials');
      }
      const jwtToken = jwt.sign(
        {
          displayName: user.data().displayName,
          userId: user.id,
          type: 'access_token',
        },
        'welovegito',
      );
      const refreshToken = jwt.sign(
        {
          userId: user.id,
          type: 'refresh_token',
        },
        'welovegito',
      );
      return this.AuthTokenMap({
        accessToken: jwtToken,
        refreshToken: refreshToken,
      });
    } catch (err) {
      return new ApolloError(err);
    }
  }

//   async loginUser(email: String, password: String) {
//     const response = this.auth.createUser({});
//   }
}

export default FirebaseAuthDataStore;
