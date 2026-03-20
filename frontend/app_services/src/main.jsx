import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { AppRoutes } from "./components";
import { ApolloProvider } from "@apollo/client/react";
import { client } from "./graphql/graphql";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ApolloProvider client={client}>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ApolloProvider>
    </BrowserRouter>
  </StrictMode>,
);
