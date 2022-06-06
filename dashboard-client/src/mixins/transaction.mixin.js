
import { mapActions, mapGetters, mapState } from 'vuex'

export const transactionMixin = {

  computed: {
    ...mapState('transactionModule', ['paymentMethodSummaries', 'periodSummaries', 'transactions']),
    ...mapGetters('transactionModule', ['failedTransactions', 'completedTransactions', 'cancelledTransactions']),

    failedTransactionPeriodSummary() {
      const aggregate = this.aggregateByDate(this.failedTransactions);
      return aggregate;
    },  

    cancelledTransactionPeriodSummary() {
      const aggregate = this.aggregateByDate(this.cancelledTransactions);
      return aggregate;
    },

    completedTransactionPeriodSummary() {
      const aggregate = this.aggregateByDate(this.completedTransactions);
      return aggregate;
    },

    orderedPeriodSummary() {
      const summaries =  [...this.periodSummaries]
      return summaries.sort( function(a, b) {
        return new Date(a.month) - new Date(b.month)
      })
    }
  },

  methods: {
    ...mapActions('transactionModule', ['fetchStatistics', 'fetchTransactions']),
    
    aggregateByDate(transactions) {
      const groupedTransactions = new Array(12).fill({ total: 0 });

      for (const transaction of transactions) {
        const transactionDate = transaction.dateCreated.substr(0,7);
        const month = transaction.dateCreated.substr(5,2);
        const foundIndex = groupedTransactions.findIndex( transaction => transaction?.dateCreated == transactionDate );
        if(foundIndex == -1) {
          groupedTransactions[month.replace(/^0/g, '')] = {
            dateCreated: transactionDate,
            total: transaction.totalPriceWithDiscount || 0
          }
          continue;
        }
        groupedTransactions[foundIndex].total += transaction.totalPriceWithDiscount;
      }
      return groupedTransactions;
    }
  }


}