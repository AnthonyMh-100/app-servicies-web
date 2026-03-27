import { Payment, Service } from "../../models/index.js";

export const earningsQueriesResolver = {
  earnings: async (_parent, { date }, { id: companyId }) => {
    try {
      const totalPaid = await Payment.sum("amount", {
        where: {
          paidDate: date,
        },
        include: [
          {
            association: Payment.associations.service,
            attributes: [],
            required: true,
            where: { companyId },
          },
        ],
      });

      const totalPending = await Service.sum("total_pending", {
        where: {
          companyId,
          createdDate: date,
        },
      });

      const totalServices = await Service.count({
        where: {
          companyId,
          createdDate: date,
        },
      });

      return {
        totalPaid: Number(totalPaid) || 0,
        totalPending: Number(totalPending) || 0,
        totalServices: totalServices || 0,
      };
    } catch (error) {
      throw new Error(`Error calculating earnings: ${error.message}`);
    }
  },
};
