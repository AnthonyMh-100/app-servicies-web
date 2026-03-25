import { Payment, Service } from "../../models/index.js";
import { validateFieldsService, validatePaymentInfo } from "./utils/utils.js";
import moment from "moment";
import sequelize from "../../database/conexion.js";

export const serviceMutationsResolver = {
  createService: async (_parent, { serviceInfo }, { id: companyId }) => {
    validateFieldsService(serviceInfo);

    const isCompleted =
      serviceInfo.isCompleted !== undefined
        ? serviceInfo.isCompleted
        : !serviceInfo.total_pending || serviceInfo.total_pending === 0;

    const service = await Service.create({
      ...serviceInfo,
      companyId,
      isCompleted,
    });
    const { id: serviceId, total: serviceTotal } = service;

    if (isCompleted) {
      await Payment.create({
        serviceId,
        paidDate: moment().format("YYYY-MM-DD"),
        amount: serviceTotal || 0,
      });
    }

    return service;
  },
  createServicePayment: async (
    _parent,
    { serviceId, paymentInfo },
    { id: companyId },
  ) => {
    try {
      return await sequelize.transaction(async () => {
        validatePaymentInfo(paymentInfo);

        const service = await Service.findOne({
          where: {
            id: serviceId,
            companyId,
          },
        });

        if (!service) throw new Error("Service not found!");

        const { total: totalService } = service;

        const payment = await Payment.create({
          serviceId,
          paidDate: paymentInfo.paidDate,
          amount: paymentInfo.amount,
          note: paymentInfo.note ?? null,
        });

        const totalPaid = await Payment.sum("amount", {
          where: { serviceId },
        });

        if (Number(totalPaid) === Number(totalService)) {
          await service.update({ isCompleted: true });
        }

        if (totalPaid > totalService) {
          throw new Error(
            `Total paid (${totalPaid}) exceeds total service amount (${totalService}).`,
          );
        }

        return payment;
      });
    } catch (error) {
      return error;
    }
  },
  deleteService: async (_parent, { serviceId }, { id: companyId }) => {
    const service = await Service.findOne({
      where: {
        id: serviceId,
        companyId,
      },
    });
    if (!service) throw new Error("Service not found!");
    await service.destroy();
    return true;
  },
  editService: async (
    _parent,
    { serviceId, serviceInfo },
    { id: companyId },
  ) => {
    const service = await Service.findOne({
      where: {
        id: serviceId,
        companyId,
      },
    });
    if (!service) throw new Error("Service not found!");

    if (serviceInfo.isCompleted === undefined) {
      serviceInfo.isCompleted =
        !serviceInfo.total_pending || serviceInfo.total_pending === 0;
    }

    await service.update(serviceInfo);
    return service;
  },
};

export const serviceQueriesResolver = {
  services: async (
    _parent,
    { date, limitPerPage = 4, page = 0, withPagination = false },
    { id: companyId },
  ) => {
    const services = await Service.findAll({
      where: {
        companyId,
        ...(date && {
          createdDate: date,
        }),
      },
      ...(withPagination && {
        limit: limitPerPage,
        offset: limitPerPage * page,
      }),
      order: [
        ["id", "DESC"],
        ["createdDate", "DESC"],
      ],
    });

    return services;
  },
  servicePayments: async (_parent, { serviceId }, { id: companyId }) => {
    const service = await Service.findOne({
      include: {
        association: Service.associations.payments,
      },
      where: {
        id: serviceId,
        companyId,
      },
    });

    if (!service) throw new Error("Service not found!");

    const payments = await Payment.findAll({
      where: {
        serviceId,
      },
      order: [
        ["paidDate", "DESC"],
        ["id", "DESC"],
      ],
    });

    return payments;
  },
};
