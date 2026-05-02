import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import {
  companyModel,
  companyMutations,
  companyMutationsResolver,
  companyQueries,
  companyQueriesResolver,
} from "./src/schemas/company/index.js";
import {
  serviceModel,
  serviceMutations,
  serviceMutationsResolver,
  serviceQueries,
  serviceQueriesResolver,
} from "./src/schemas/service/index.js";
import {
  earningsModel,
  earningsQueries,
  earningsQueriesResolver,
} from "./src/schemas/earnings/index.js";
import sequelize from "./src/database/conexion.js";
import "./src/models/index.js";
import "dotenv/config";
import jwt from "jsonwebtoken";

const typeDefs = `#graphql
    ${companyModel}
    ${serviceModel}
    ${earningsModel}
    type Query{
        ${companyQueries}
        ${serviceQueries}
        ${earningsQueries}
    }
    type Mutation{
      ${companyMutations}
      ${serviceMutations}
    }
    
`;

const resolvers = {
  Query: {
    ...companyQueriesResolver,
    ...serviceQueriesResolver,
    ...earningsQueriesResolver,
  },
  Mutation: {
    ...companyMutationsResolver,
    ...serviceMutationsResolver,
  },
};

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

await sequelize.authenticate();

// await sequelize.sync({ alter: true });

app.use(
  "/graphql",
  cors(),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => {
      const header = req.headers["authorization"] || [];
      const token = header.length ? header.split(" ")[1] : null;
      const information = token
        ? jwt.verify(token, process.env.SECRET_KEY)
        : null;
      return information;
    },
  }),
);

await new Promise((resolve) =>
  httpServer.listen({ port: process.env.PORT }, resolve),
);
console.log(
  `Servidor listo en ${process.env.APP_URL_PROD || `http://localhost:${process.env.PORT}/graphql`}`,
);
