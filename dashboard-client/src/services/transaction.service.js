import { Http } from '../utils/http'

export class TransactionService extends Http {
  constructor(){
    super();
  }

  setupAutomaticInvoicing(restaurantId, invoiceFrequencyInWeeks, startDate, endDate) {
    return this.httpClient.post(`/restaurants/${restaurantId}/invoices`, { invoiceFrequencyInWeeks, startDate, endDate })
  }

  updateInvoiceStatus(invoiceId, restaurantId, totalAmountPaid) {
    return this.httpClient.patch(`/restaurants/${restaurantId}/invoices/${invoiceId}`, { totalAmountPaid });
  }

  updateInvoiceFrequency(restaurantId, invoiceFrequency) {
    return this.httpClient.patch(`/restaurants/${restaurantId}`, {invoiceFrequency} )
  }

  update(restaurantId, updatedInvoice) {
    return this.httpClient.patch(`/restaurants/${restaurantId}`, {updatedInvoice})
  }

  async getTransaction(restaurantName, startDate, endDate) {
    let queryString = "?";
    if(restaurantName)
      queryString += `restaurantName=${restaurantName}&`;
    if(startDate)
      queryString += `startDate=${startDate}&`;
    if(endDate)
      queryString += `endDate=${endDate}&`;

    return await this.httpClient().get(`/restaurants/transactions${queryString}`);
  }


  delete(restaurantId, invoiceId) {
    return this.httpClient.delete(`/restaurants/${restaurantId}/invoices/${invoiceId}`);
  }
}