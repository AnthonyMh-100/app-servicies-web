export const serviceModel = `
   type Payment {
        id: Int!
        paidDate: String!
        amount: Float!
        method: String
        note: String
        serviceId: Int!
    }

    input PaymentInfo {
        paidDate: String!
        amount: Float!
        note: String
    }

   type Service {
        id: Int!
        createdDate:String
        name: String!
        description: String!
        delivery_date: String!
        isCompleted: Boolean
        total: Float!
        total_advance:Float!
        total_pending: Float!
    }

    input ServiceInfo {
        name: String!
        description: String!
        delivery_date: String!
        createdDate: String!
        isCompleted: Boolean
        total: Float!
        total_advance:Float
        total_pending: Float
        status: Boolean
    }

    input EditServiceInfo {
        name: String
        description: String
        delivery_date: String
        isCompleted: Boolean
        total: Float
        total_advance:Float
        total_pending: Float
        status: Boolean
    }

    input Filters{
        date: String
    }
        
`;
