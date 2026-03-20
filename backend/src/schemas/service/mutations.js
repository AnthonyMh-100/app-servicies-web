export const serviceMutations = `
  createService(serviceInfo: ServiceInfo!): Service!
  deleteService(serviceId:Int!): Boolean
  editService(serviceId:Int!, serviceInfo: EditServiceInfo!): Service!
`;
