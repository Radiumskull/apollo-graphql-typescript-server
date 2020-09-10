import { ApolloServer } from 'apollo-server';
import typeDefs from './schema/typedefs';
import resolvers from './schema/resolver';
import firebaseAPI from './schema/DataSources/FirestoreDataSource';
import jwt from 'jsonwebtoken';

import { config } from 'dotenv';
import FirebaseAuthDataStore from './schema/DataSources/FirebaseAuthDataSource';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    firebaseAPI: new firebaseAPI(),
    authAPI: new FirebaseAuthDataStore(),
  }),
  context: ({ req }) => {
    const user = null;
    const dummy = req.headers.authorization;

    // if(req.headers.authorization !== undefined)
    //   user = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET)
    return {
      user,
      dummy,
    };
  },
  engine: {
    reportSchema: true,
  },
});

// server.listen().then(({ url }) => {
//   console.log(`🚀 Server ready at ${url}`);
// });

server.listen();
