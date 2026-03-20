import { GraphQLError } from "graphql";

export const validateFieldsService = ({ name, description, delivery_date }) => {
  if (name && !name.trim()) throw new GraphQLError("Field name is required!");

  if (description && !description.trim())
    throw new GraphQLError("Field description is required!");

  if (delivery_date && !delivery_date.trim())
    throw new GraphQLError("Field delivery date is required!");
};
