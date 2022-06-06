import { Http } from '../utils/http'

export class TransactionService extends Http {
  endpoint = "/tookan/tasks"

  constructor(){
    super();
  }

  uploadTransactions(transactions){
    return this.httpClient().post(`${this.endpoint}/upload`, transactions)
  }

  fetchTransactions(startDate, endDate, merchantName) {
    let queryStrying = '?';
    if(startDate)
      queryStrying += `startDate=${startDate}&`;
    if(endDate)
      queryStrying += `endDate=${endDate}&`;
    if(merchantName)
      queryStrying += `merchantName=${merchantName}&`;

    return this.httpClient().get(`/tookan/tasks${queryStrying}`);
  }

  fetchStatistics(startDate, endDate, merchantName, period) {
    let queryString = "?";
    if (merchantName) queryString += `merchantName=${merchantName}&`;
    if (startDate) queryString += `startDate=${startDate}&`;
    if (endDate) queryString += `endDate=${endDate}&`;
    if (period) queryString += `period=${period}`;

    return this.httpClient().get(`/tookan/tasks/statistics${queryString}`);
  }

  fetchStatements(startDate, endDate, merchantId, skip, limit){
    let queryString = "?";
    if (merchantId) queryString += `merchantId=${merchantId}&`;
    if (startDate) queryString += `startDate=${startDate}&`;
    if (endDate) queryString += `endDate=${endDate}&`;
    if (skip) queryString += `skip=${skip}`;
    if (limit) queryString += `limit=${limit}`;

    return this.httpClient().get(`/statements${queryString}`)
  }
}