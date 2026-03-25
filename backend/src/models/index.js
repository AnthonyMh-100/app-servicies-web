import Company from "./Company.js";
import Payment from "./Payment.js";
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

Service.hasMany(Payment, {
  as: "payments",
  foreignKey: {
    name: "serviceId",
    allowNull: false,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
});

Payment.belongsTo(Service, {
  as: "service",
  foreignKey: {
    name: "serviceId",
    allowNull: false,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
});

export { Company, Payment, Service };
