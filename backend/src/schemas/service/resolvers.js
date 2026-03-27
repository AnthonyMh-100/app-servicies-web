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
      const paidDate =
        serviceInfo.createdDate || moment().format("YYYY-MM-DD");
      await Payment.create({
        serviceId,
        paidDate,
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
    return await sequelize.transaction(async (transaction) => {
      validatePaymentInfo(paymentInfo);

      const service = await Service.findOne({
        where: {
          id: serviceId,
          companyId,
        },
        transaction,
      });

      if (!service) throw new Error("Service not found!");

      const totalService = Number(service.total) || 0;

      const payment = await Payment.create(
        {
          serviceId,
          paidDate: paymentInfo.paidDate,
          amount: paymentInfo.amount,
          note: paymentInfo.note ?? null,
        },
        { transaction },
      );

      const totalPaid = await Payment.sum("amount", {
        where: { serviceId },
        transaction,
      });

      if (Number(totalPaid) > Number(totalService)) {
        throw new Error(
          `Total paid (${totalPaid}) exceeds total service amount (${totalService}).`,
        );
      }

      const isCompleted = Number(totalPaid) === Number(totalService);
      const totalPending = Math.max(Number(totalService) - Number(totalPaid), 0);

      await service.update(
        {
          isCompleted,
          total_advance: Number(totalPaid) || 0,
          total_pending: totalPending,
        },
        { transaction },
      );

      return payment;
    });
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
      where: { id: serviceId, companyId },
    });

    if (!service) throw new Error("Service not found!");

    const updateData = { ...serviceInfo };

    if (Number(updateData.total) > Number(service.total)) {
      updateData.isCompleted = false;
    }

    await service.update(updateData);
    await service.reload();

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
