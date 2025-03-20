<<<<<<< HEAD
const { ApolloServer } = require('@apollo/server');
const { PubSub } = require('graphql-subscriptions');
const { gql } = require('graphql-tag');
const { PrismaClient } = require('@prisma/client');
const { startStandaloneServer } = require('@apollo/server/standalone');

const prisma = new PrismaClient();
const pubsub = new PubSub();
=======
const { ApolloServer, gql } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
>>>>>>> 1d869a3eaea82a2d8033a88a30294423d58edfff

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
<<<<<<< HEAD
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
=======
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
>>>>>>> 1d869a3eaea82a2d8033a88a30294423d58edfff
