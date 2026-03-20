import { DataTypes } from "@sequelize/core";
import sequelize from "../database/conexion.js";

const Service = sequelize.define(
  "Service",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    createdDate: {
      type: DataTypes.DATEONLY,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    delivery_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    total_advance: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    total_pending: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
  },
  {
    tableName: "services",
    timestamps: true,
  },
);

export default Service;
