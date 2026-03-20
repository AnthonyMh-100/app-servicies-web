import "dotenv/config";
import { Sequelize } from "@sequelize/core";
import { MySqlDialect } from "@sequelize/mysql";

const sequelize = new Sequelize({
  dialect: MySqlDialect,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
});

export default sequelize;
