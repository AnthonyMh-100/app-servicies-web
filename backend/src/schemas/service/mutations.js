export const serviceMutations = `
  createService(serviceInfo: ServiceInfo!): Service!
  createServicePayment(serviceId:Int!, paymentInfo: PaymentInfo!): Payment!
  deleteService(serviceId:Int!): Boolean
  editService(serviceId:Int!, serviceInfo: EditServiceInfo!): Service!
`;
