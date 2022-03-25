export type GroupByOptions = {
  propertyToGroupBy?: 'merchantName' | 'paymentMethod';
  merchantName?: string;
  startDate?: string;
  endDate?: string;
  returnItems?: boolean;
  jobStatus?: number;
};
