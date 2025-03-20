const { ApolloServer, gql } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Define GraphQL schema
const typeDefs = gql`
  type User {
    id: Int!
    name: String!
    email: String!
    createdAt: String!
  }

  type Query {
    users: [User!]!
    user(id: Int!): User
  }

  type Mutation {
    createUser(name: String!, email: String!): User!
    updateUser(id: Int!, name: String, email: String): User!
    deleteUser(id: Int!): User!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    users: () => prisma.user.findMany(),
    user: (_, { id }) => prisma.user.findUnique({ where: { id } }),
  },
  Mutation: {
    createUser: (_, { name, email }) => prisma.user.create({ data: { name, email } }),
    updateUser: (_, { id, name, email }) => prisma.user.update({
      where: { id },
      data: { name, email },
    }),
    deleteUser: (_, { id }) => prisma.user.delete({ where: { id } }),
  }
};

// Apollo Server setup
const server = new ApolloServer({ typeDefs, resolvers });

server.listen(4001).then(({ url }) => {
  console.log(`Server running at ${url}`);
});
