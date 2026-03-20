import Service from "../../models/Service.js";
import sequelize from "../../database/conexion.js";

export const earningsQueriesResolver = {
  earnings: async (_parent, { date }, { id: companyId }) => {
    try {
      const paidServices = await Service.findAll({
        where: {
          companyId,
          createdDate: date,
          isCompleted: true,
        },
        attributes: [
          [sequelize.fn("SUM", sequelize.col("total")), "totalPaid"],
        ],
        raw: true,
      });

      const pendingServices = await Service.findAll({
        where: {
          companyId,
          createdDate: date,
        },
        attributes: [
          [sequelize.fn("SUM", sequelize.col("total_pending")), "totalPending"],
        ],
        raw: true,
      });

      const totalServices = await Service.findAll({
        where: {
          companyId,
          createdDate: date,
        },
        attributes: [
          [sequelize.fn("SUM", sequelize.col("total")), "totalServices"],
        ],
        raw: true,
      });

      return {
        totalPaid: paidServices[0]?.totalPaid || 0,
        totalPending: pendingServices[0]?.totalPending || 0,
        totalServices: totalServices[0]?.totalServices || 0,
      };
    } catch (error) {
      throw new Error(`Error calculating earnings: ${error.message}`);
    }
  },
};
