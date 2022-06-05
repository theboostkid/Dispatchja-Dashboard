export type GroupByOptions = {
  propertyToGroupBy?: 'merchantName' | 'paymentMethod';
  merchantName?: string;
  merchantId?: string;
  startDate?: string;
  endDate?: string;
  returnItems?: boolean;
  jobStatus?: number;
};
