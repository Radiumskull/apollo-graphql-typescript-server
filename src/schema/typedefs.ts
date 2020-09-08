import { gql } from 'apollo-server';

//User
//Posts

const typeDefs = gql`
  type User {
    id: ID!
    userId: String!
    screenName: String!
    salt: String!
    hash: String!
    date_of_birth: String!
    posts: [Post]
  }

  type Post {
    id: ID!
    text: String!
    userId: String!
    user: User!
    likes: Int!
  }

  type Query {
    posts: [Post]
    users: [User]
    user(id: String!): User
  }

  type Mutation {
    createUser(email: String!, password: String!): String
  }
`;

export default typeDefs;
