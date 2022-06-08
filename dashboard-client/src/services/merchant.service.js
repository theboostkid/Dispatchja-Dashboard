import { Http } from "../utils/http";

export class MerchantService extends Http {
  constructor() {
    super();
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

  updateMerchant(id, updates){
    return this.httpClient().patch(`/merchants/${id}`, updates);
  }

  fetchMerchants() {
    return this.httpClient().get(`/merchants`);
  }

  deleteMerchant(merchantId) {
    return this.httpClient().delete(`/merchants/${merchantId}`);
  }
}
