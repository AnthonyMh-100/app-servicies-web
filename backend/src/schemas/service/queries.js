export const serviceQueries = `
    services(date: String, limitPerPage: Int, page:Int, withPagination:Boolean): [Service]
    servicePayments(serviceId: Int!): [Payment]
    serviceHistory(date: String!): [Service]
`;
