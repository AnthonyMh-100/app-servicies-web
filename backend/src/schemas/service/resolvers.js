import { Service } from "../../models/index.js";
import { validateFieldsService } from "./utils/utils.js";
import moment from "moment/moment.js";

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
    return service;
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
};
