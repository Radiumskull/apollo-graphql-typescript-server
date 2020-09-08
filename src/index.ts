import { ApolloServer } from 'apollo-server';
import typeDefs from './schema/typedefs';
import resolvers from './schema/resolver';
import firebaseAPI from './schema/datasource';
import { config } from 'dotenv';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({ firebaseAPI: new firebaseAPI() }),
  engine: {
    reportSchema: true,
  },
});

// server.listen().then(({ url }) => {
//   console.log(`🚀 Server ready at ${url}`);
// });

server.listen();
