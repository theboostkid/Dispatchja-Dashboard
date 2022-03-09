import { Http } from '../utils/http'

export class InvoiceService extends Http {
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
    return this.httpClient.patch(`/restaurants/${restaurantId}` )
  }

  update(restaurantId, updatedInvoice) {
    return this.httpClient.patch(`/restaurants/${restaurantId}`)
  }

  getTransaction(restaurantName, startDate, endDate) {
    let queryString = "?";
    if(restaurantName)
      queryString += `restaurantName=${restaurantName}`;
    if(startDate)
      queryString += `startDate=${startDate}`;
    if(endDate)
      queryString += `endDate=${endDate}`;

    return this.httpClient(`/restaurants/transactions${queryString}`);
  }


  delete(restaurantId, invoiceId) {
    return this.httpClient.delete(`/restaurants/${restaurantId}/invoices/${invoiceId}`);
  }
}