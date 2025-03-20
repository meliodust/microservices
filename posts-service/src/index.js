const { ApolloServer } = require('@apollo/server');
const { PubSub } = require('graphql-subscriptions');
const { gql } = require('graphql-tag');
const { PrismaClient } = require('@prisma/client');
const { startStandaloneServer } = require('@apollo/server/standalone');

const prisma = new PrismaClient();
const pubsub = new PubSub();

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
  }

  type Subscription {
    postAdded: Post!
  }
`;

const resolvers = {
  Query: {
    posts: async () => await prisma.post.findMany(),
    post: async (_, { id }) => await prisma.post.findUnique({ where: { id } }),
  },

  Mutation: {
    createPost: async (_, { title, content, authorId }) => {
      const newPost = await prisma.post.create({
        data: { title, content, authorId },
      });
      pubsub.publish('POST_ADDED', { postAdded: newPost });
      return newPost;
    },
  },

  Subscription: {
    postAdded: {
      subscribe: () => pubsub.asyncIterator(['POST_ADDED']),
    },
  },
};

async function startServer() {
  const server = new ApolloServer({ typeDefs, resolvers });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀 Server ready at: ${url}`);
}

startServer();
