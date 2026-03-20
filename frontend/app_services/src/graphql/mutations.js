import { gql } from "@apollo/client";

export const CREATE_COMPANY = gql`
  mutation createCompany($companyInfo: CompanyInfo!) {
    createCompany(companyInfo: $companyInfo) {
      id
      code
      name
      token
      username
    }
  }
`;

export const CREATE_SERVICE = gql`
  mutation createService($serviceInfo: ServiceInfo!) {
    createService(serviceInfo: $serviceInfo) {
      id
      createdDate
      description
      delivery_date
      name
      total
      total_advance
      total_pending
    }
  }
`;

export const EDIT_SERVICE = gql`
  mutation editService($serviceId: Int!, $serviceInfo: EditServiceInfo!) {
    editService(serviceId: $serviceId, serviceInfo: $serviceInfo) {
      id
      createdDate
      description
      delivery_date
      name
      total
      total_advance
      total_pending
    }
  }
`;

export const DELETE_SERVICE = gql`
  mutation deleteService($serviceId: Int!) {
    deleteService(serviceId: $serviceId)
  }
`;

export const LOGIN_COMPANY = gql`
  mutation loginCompany($username: String!, $password: String!) {
    loginCompany(username: $username, password: $password) {
      id
      code
      name
      token
      username
    }
  }
`;
