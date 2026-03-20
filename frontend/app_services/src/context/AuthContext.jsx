import { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { COMPANY } from "../graphql/queries";
import {
  companyIdVar,
  companyNameVar,
  companyUserNameVar,
} from "../graphql/reactiveVars";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const getToken = localStorage.getItem("token");
    return getToken ?? "";
  });
  const [user, setUser] = useState(() => {
    const getUser = localStorage.getItem("user");
    return getUser ? JSON.parse(getUser) : "";
  });
  const [companyId, setCompanyId] = useState(() => {
    const stored = localStorage.getItem("companyId");
    const id = stored ? Number(stored) : null;
    return Number.isFinite(id) ? id : null;
  });

  const { data } = useQuery(COMPANY, {
    fetchPolicy: "cache-first",
    variables: {
      companyId,
    },
  });

  useEffect(() => {
    if (!data?.company) return;
    const { company } = data;
    const { id, name, username } = company;
    companyIdVar(id);
    companyNameVar(name);
    companyUserNameVar(username);

    localStorage.setItem("companyId", id);
  }, [data]);

  return (
    <AuthContext.Provider
      value={{ token, setToken, user, setUser, companyId, setCompanyId }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthentication = () => useContext(AuthContext);
