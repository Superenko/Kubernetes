import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { json } from 'body-parser';
import morgan from 'morgan';
import db from './modules/db';
import schema from './graphql/schema';
import resolvers from './graphql/resolvers';
interface MyContext {
  token?: string;
}

const app = express();
app.use(morgan('dev')); // logger

app.get('/', async (req, res) => {
  const submissions = await db.submission.findMany();
  res.json(submissions);
});

const startServer = async () => {
  const httpServer = http.createServer(app);
  const server = new ApolloServer<MyContext>({
    typeDefs: schema,
    resolvers: resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token }),
    })
  );

  const port = Number(process.env.PORT ?? 8080);
  await new Promise<void>((resolve) =>
    httpServer.listen({ host: '0.0.0.0', port }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
};
startServer();

// app.listen(port, '0.0.0.0', () => {
//   console.log(`Server running at http://localhost:${port}`);
// });
