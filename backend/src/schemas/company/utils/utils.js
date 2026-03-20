import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const getToken = ({ id, code, name, username }) => {
  const token = jwt.sign(
    {
      id,
      code,
      name,
      username,
    },
    process.env.SECRET_KEY,
  );
  return token;
};

export const validateFieldsCompany = ({ code, name, password, username }) => {
  if (code && !code.trim().length)
    throw new GraphQLError("Field code is requied!");
  if (name && !name.trim().length)
    throw new GraphQLError("Field name is requied!");
  if (password && !password.trim().length)
    throw new GraphQLError("Field password is requied!");
  if (username && !username.trim().length)
    throw new GraphQLError("Field username is requied!");
};
