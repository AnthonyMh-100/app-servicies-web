import "dotenv/config";
import { Op } from "@sequelize/core";
import { getToken } from "./utils/utils.js";
import bcrypt from "bcrypt";

import { Company } from "../../models/index.js";
import { GraphQLError } from "graphql";
import { validateFieldsCompany } from "./utils/utils.js";

const SALTS_ROUNDS = 10;

export const companyMutationsResolver = {
  createCompany: async (_parent, { companyInfo }) => {
    validateFieldsCompany(companyInfo);

    const { code, name, username, password } = companyInfo;

    const companyExists = await Company.findOne({
      where: {
        [Op.or]: [{ code }, { name }, { username }],
      },
    });
    if (companyExists) throw new GraphQLError("Company already exists!");

    const hashedPassword = await bcrypt.hash(password, SALTS_ROUNDS);

    const company = await Company.create({
      ...companyInfo,
      password: hashedPassword,
    });
    const token = getToken(company);

    const companyFormatted = {
      ...company.get({ plain: true }),
      token,
    };

    return companyFormatted;
  },
  loginCompany: async (_parent, { username, password }) => {
    validateFieldsCompany({ username, password });

    const company = await Company.findOne({
      where: { username },
    });

    if (!company) throw new GraphQLError("Invalid credentials");

    const { password: passwordCompany } = company;
    const verifyPassword = await bcrypt.compare(password, passwordCompany);

    if (!verifyPassword) throw new GraphQLError("Invalid credentials");

    const token = getToken(company);

    const companyFormatted = {
      ...company.get({ plain: true }),
      token,
    };

    return companyFormatted;
  },
};

export const companyQueriesResolver = {
  company: async (_parent, { companyId }, { id: authCompanyId } = {}) => {
    if (!authCompanyId) throw new GraphQLError("Unauthorized");
    if (companyId !== authCompanyId) throw new GraphQLError("Unauthorized");

    const company = await Company.findByPk(companyId);
    if (!company) throw new GraphQLError("Company not found");

    return company;
  },
};
