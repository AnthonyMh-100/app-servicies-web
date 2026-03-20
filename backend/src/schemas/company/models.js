export const companyModel = `
   type Company {
        id: Int!
        code: String!
        name: String!
        phone: String
        username: String!
        token: String
    }
    input CompanyInfo {
        code: String!
        name: String!
        phone: String
        username: String!
        password: String!
    }
`;
