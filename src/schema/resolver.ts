import { ApolloError, ValidationError } from 'apollo-server';
import admin from '../config/firebase';
import { UserMap, PostMap } from './MappingFunctions';

const resolvers = {
  User: {
    posts: (user: any, __: any, { dataSources }: any) =>
      dataSources.firebaseAPI.getDocumentById(
        'posts',
        { parameter: 'userId', value: user.userId },
        PostMap,
      ),
  },

  Post: {
    user: (post: any, __: any, { dataSources }: any) =>
      dataSources.firebaseAPI.getDocument(`users/${post.userId}`, UserMap),
  },

  Query: {
    posts: (_: any, __: any, { dataSources, dummy }: any) => {
      return dataSources.firebaseAPI.getCollection('posts', PostMap);
    },
    users: (_: any, __: any, { dataSources }: any) => {
      return dataSources.firebaseAPI.getCollection('users', UserMap);
    },
    user(_: any, args: any, { dataSources }: any) {
      return dataSources.firebaseAPI.getDocument(`users/${args.id}`, UserMap);
    },
  },

  Mutation: {
    createUser: async (
      _: null,
      { displayName, email, password }: any,
      { dataSources }: any,
    ) => {
      const authToken = dataSources.authAPI.createUser(
        displayName,
        email,
        password,
      );
      return authToken;
    },
    createPost: async (
      _: null,
      { title, text, userId }: any,
      { dataSources }: any,
    ) => {
      const postId = dataSources.firebaseAPI.createDocument('posts', {
        title: title,
        text: text,
        userId: userId,
      });
      return {
        response: 'Success',
        postId: postId,
      };
    },
  },
};

export default resolvers;
