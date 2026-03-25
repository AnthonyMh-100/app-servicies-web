import { gql } from "@apollo/client";

export const SERVICES = gql`
  query services(
    $date: String
    $limitPerPage: Int
    $page: Int
    $withPagination: Boolean
  ) {
    services(
      date: $date
      limitPerPage: $limitPerPage
      page: $page
      withPagination: $withPagination
    ) {
      id
      createdDate
      description
      delivery_date
      isCompleted
      name
      total
      total_advance
      total_pending
    }
  }
`;

export const EARNINGS = gql`
  query earnings($date: String!) {
    earnings(date: $date) {
      totalPaid
      totalPending
      totalServices
    }
  }
`;

export const COMPANY = gql`
  query company($companyId: Int!) {
    company(companyId: $companyId) {
      id
      code
      name
      phone
      username
    }
  }
`;

export const SERVICE_PAYMENTS = gql`
  query servicePayments($serviceId: Int!) {
    servicePayments(serviceId: $serviceId) {
      id
      paidDate
      amount
      method
      note
      serviceId
    }
  }
`;

