import { useApolloClient } from "@apollo/client/react";
import { useNavigate } from "react-router";
import { useAuthentication } from "../../context/AuthContext";
import {
  companyIdVar,
  companyNameVar,
  companyUserNameVar,
} from "../../graphql/reactiveVars";

export const useLogout = () => {
  const client = useApolloClient();
  const navigate = useNavigate();
  const { setToken, setUser, setCompanyId } = useAuthentication();

  return async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("companyId");

    setToken("");
    setUser("");
    setCompanyId(null);

    companyIdVar(null);
    companyNameVar(null);
    companyUserNameVar(null);

    try {
      await client.clearStore();
    } finally {
      navigate("/login", { replace: true });
    }
  };
};
