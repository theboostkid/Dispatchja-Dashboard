import { Http } from '../utils/http'

export class TransactionService extends Http {
  endpoint = "/tookan/tasks"

  constructor(){
    super();
  }

  uploadTransactions(transactions){
    return this.httpClient().post(`${this.endpoint}/upload`, transactions)
  }

  getTransactions( merchantName, startDate, endDate ){
    let queryString = "";
    if(merchantName) {
      queryString+=`merchantName=${merchantName}&`
    }
    if(startDate) {
      queryString+=`startDate=${startDate}&`
    }
    if(endDate) {
      queryString+=`endDate=${endDate}&`
    }
    return this.httpClient().get(`${this.endpoint}?${queryString}`)
  }
}