import Company from "./Company.js";
import Service from "./Service.js";

Company.hasMany(Service, {
  as: "service",
  foreignKey: {
    name: "companyId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
});

Service.belongsTo(Company, {
  as: "company",
  foreignKey: {
    name: "companyId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
});

export { Company, Service };
