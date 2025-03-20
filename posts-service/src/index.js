const { ApolloServer, gql } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Define GraphQL schema
const typeDefs = gql`
  type Post {
    id: Int!
    title: String!
    content: String!
    authorId: Int!
    createdAt: String!
  }

  type Query {
    posts: [Post!]!
    post(id: Int!): Post
  }

  type Mutation {
    createPost(title: String!, content: String!, authorId: Int!): Post!
    updatePost(id: Int!, title: String, content: String): Post!
    deletePost(id: Int!): Post!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    posts: () => prisma.post.findMany(),
    post: (_, { id }) => prisma.post.findUnique({ where: { id } }),
  },
  Mutation: {
    createPost: (_, { title, content, authorId }) => prisma.post.create({
      data: { title, content, authorId },
    }),
    updatePost: (_, { id, title, content }) => prisma.post.update({
      where: { id },
      data: { title, content },
    }),
    deletePost: (_, { id }) => prisma.post.delete({ where: { id } }),
  }
};

// Apollo Server setup
const server = new ApolloServer({ typeDefs, resolvers });

server.listen(4002).then(({ url }) => {
  console.log(`Server running at ${url}`);
});
