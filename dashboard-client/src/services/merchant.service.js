import { Http } from "../utils/http";

export class MerchantService extends Http {
  constructor() {
    super();
  }

  async getStatistics(merchantName, startDate, endDate, period) {
    let queryString = "?";
    if (merchantName) queryString += `merchantName=${merchantName}&`;
    if (startDate) queryString += `startDate=${startDate}&`;
    if (endDate) queryString += `endDate=${endDate}&`;
    if (period) queryString += `period=${period}`;
    else queryString += `period=monthly`;

    return await this.httpClient().get(
      `/tookan/tasks/statistics${queryString}`
    );
  }

  createMerchant(
    name,
    merchantId,
    email,
    address,
    province,
    country,
    startDate,
    endDate,
    statementFrequencyInWeeks,
    isActive
  ) {
    return this.httpClient().post(`/merchants`, {
      name,
      merchantId,
      email,
      address,
      province,
      country,
      startDate,
      endDate,
      statementFrequencyInWeeks,
      isActive,
    });
  }

  updateMerchant(merchantId, invoiceFrequencyInWeeks, email) {
    return this.httpClient().patch(`/merchants/${merchantId}`, {
      invoiceFrequencyInWeeks,
      email,
    });
  }

  getMerchants() {
    return this.httpClient().get(`/merchants`);
  }

  deleteMerchant(merchantId) {
    return this.httpClient().delete(`/merchants/${merchantId}`);
  }
}
