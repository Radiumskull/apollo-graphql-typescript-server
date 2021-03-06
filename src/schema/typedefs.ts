import { gql } from 'apollo-server';

//User
//Posts

const typeDefs = gql`
  type AuthResponse {
    accessToken: String!
    refreshToken: String!
  }

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
    title: String!
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
    createUser(
      email: String!
      password: String!
      displayName: String!
    ): AuthResponse
    createPost(title: String!, text: String!, userId: ID!): String
  }
`;

export default typeDefs;
