<template>
  <Layout>
    <PageHeader :title="title" :items="items" />

    <div class="row">
      <div class="col-3 mb-5">
        <label for="merchants">Please select a merchant</label>
        <b-form-select
          id="input-5"
          class="form-select"
          type="text"
          v-model="selectedMerchant"
          @change="getMerchantStats"
        >
          <template #first>
            <b-form-select-option class="mb-5" :value="null" disabled>-- Please select an option --</b-form-select-option>
          </template>

          <b-form-select-option class="mb-5" value="all"> All </b-form-select-option>

          <b-form-select-option  
            v-for="merchant in allMerchants" 
            class="mb-5" 
            :value="merchant.name"
            :key="merchant.name"
          >  
            {{ merchant.name }}
          </b-form-select-option>
        </b-form-select>
      </div>
    </div>

    <div class="row">
      <div class="col-xl-3">
        <WidgetCard
        :title="'Total Delivery (' + new Date().getFullYear() +')'"
        :data="totalDeliveries"
        icon="fas fa-shipping-fast"
        />
      </div>

      <div class="col-xl-3">
        <WidgetCard
        :title="'Total Deliver Earnings (' + new Date().getFullYear() +')'"
        :data="totalDeliveryEarnings"
        icon="fas fa-money-bill-alt"
        />
      </div>

      <div class="col-xl-3">
        <WidgetCard
        :title="'Total Credit Card Fees (' + new Date().getFullYear() +')'"
        :data="totalCreditCardFees"
        icon="fas fa-money-check-alt"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-lg-6">
        <LineGraph
        title="Transactions"
        subtitle="This graph compares transactions that failed and transactions that were successfull"
        ref="graphTransactions"
        />
      </div>
      
      <div class="col-lg-6">
        <BarChart
        title="Deliveries Count"
        subtitle="This graph shows the total delievers that occurred over the period"
        ref="graphDeliveries"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <MixedGraph
        title="Payment Methods"
        subtitle="This graph shows a comparison between card and cash sales and the total sales made"
        ref="graphPaymentMethods"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <DataTable
        ref="table"
        :headers="headers"
        :items="tableItems"
        />
      </div>
    </div>
  </Layout>
</template>

<script>
import Layout from "../../layouts/horizontal.vue";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import WidgetCard from "@/components/widgets/card"
import LineGraph from "@/components/charts/line-chart"
import MixedGraph from "@/components/charts/mixed-chart.vue"
import BarChart from '../../../components/charts/bar-chart.vue';
import DataTable from '../../../components/tables/data-table.vue';
import { mapActions, mapState, mapGetters } from 'vuex';

/**
 * Starter component
 */
export default {
  page: {
    title: "Starter Page",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { 
    Layout, 
    PageHeader, 
    WidgetCard, 
    LineGraph, 
    MixedGraph, 
    BarChart, 
    DataTable
  },

  data() {
    return {
      title: "Merchant Reports",
      items: [
        {
          text: "reports",
        },
        {
          text: "Merchant reports",
          active: true
        }
      ],
      headers: [
        {
          label: "Date",
          key: "date"
        },
        {
          label: "Order ID",
          key: "order_id"
        },
        {
          label: "Merchant Name",
          key: "merchant_name"
        },
        {
          label: "Customer Name",
          key: "customer_name"
        },
        {
          label: "Payment Method",
          key: "payment_method"
        },
        {
          label: "Delivery Fee",
          key: "fee"
        },
        {
          label: "Subtotal",
          key: "subtotal"
        },
        {
          label: "Total",
          key: "total"
        },
        {
          label: "Delivered by",
          kwy: "delivered_by"
        },
        {
          label: "Status",
          key: "status"
        },
      ],
      tableItems: [],

      selectedMerchant: "",

      lineGraphCategories: [
        'Jan', 
        'Feb', 
        'Mar', 
        'Apr', 
        'May', 
        'Jun', 
        'Jul', 
        'Aug', 
        'Sep', 
        'Oct', 
        'Nov', 
        'Dec'
      ],
    };
  },

  async beforeMount() {
    await this.getMerchants();
  },

  computed: {
    ...mapState('merchantModule', [
      'allMerchants', 
      'totalMerchants', 
      'singleMerchantPeriodSummaries', 
      'singleMerchantSummary',
      'overallMerchantPeriodSummaries'
      ]),

    ...mapGetters('transactionModule', ['completedMerchantTransactions', 'failedMerchantTransactions', 'cancelledMerchantTransactions']),

    totalCreditCardFees(){
      return '$0'
    },

    totalDeliveryEarnings(){
      return this.formatAsMoney(this.singleMerchantSummary?.totalDeliveryFee || 0) || '$0';
    },

    totalDeliveries(){
      return this.singleMerchantSummary?.totalJobs ? this.singleMerchantSummary.totalJobs.toString() : '0';
    }
  },

  methods: {
    ...mapActions('merchantModule', ['getMerchants', 'getMerchantStatistics']),
    ...mapActions('transactionModule', ['getTransactions']),

    setTransactionChart(){
      const groupedTransactionsCompleted = this.aggregateByDate(this.completedMerchantTransactions);
      const groupedTransactionsFailed = this.aggregateByDate(this.failedMerchantTransactions);
      const groupedTransactionsCancel = this.aggregateByDate(this.cancelledMerchantTransactions);

      const orderedCompletedTransactions = this.orderByDate(groupedTransactionsCompleted, 12);
      const orderedFailedTransactions = this.orderByDate(groupedTransactionsFailed, 12);
      const orderedCancelTransactions = this.orderByDate(groupedTransactionsCancel, 12);
      
    
      const failedSeries = {
        name: 'Failed Transaction',
        color: '#FFA500',
        data: orderedFailedTransactions.map(transaction => transaction.total || 0)
      }

      const completeSeries = { 
        name: 'Completed Transaction', 
        color: "#008000",
        data: orderedCompletedTransactions.map(transaction => transaction.total || 0)
      }

      const cancelSeries = { 
        name: 'Cancel Transaction', 
        color: "#B22222",
        data: orderedCancelTransactions.map(transaction => transaction.total || 0)
      }

      this.$refs['graphTransactions'].renderChart(this.lineGraphCategories, 'monthly', [ failedSeries, completeSeries, cancelSeries ])

    },

    setPaymentMethodChart() {
      const orderedMonthlyStatistice = this.orderByDate(this.singleMerchantPeriodSummaries, 12);

      const cashSeries = {
        name: 'Cash Payments',
        data: orderedMonthlyStatistice.map( value => value.totalCashTransactions || 0)
      }

      const cardSeries = {
        name: 'Card Payments',
        data: orderedMonthlyStatistice.map( value => value.totalCardTransactions || 0)
      }

      this.$refs['graphPaymentMethods'].renderChart(this.lineGraphCategories, 'monthly', [cashSeries, cardSeries])
    },

    setDeliveryCountChart(){
      const orderedList = this.orderByDate(this.singleMerchantPeriodSummaries, 12) 
      const series = {
        name: 'Total Deliveries',
        data: orderedList.map( stat => stat ? stat.totalJobs : 0 )
      }
      console.log(series.data);

      this.$refs['graphDeliveries'].renderChart(this.lineGraphCategories, 'monthly', [series])
    },

    aggregateByDate(transactions) {
      const groupedTransactions = [];

      if(Array.isArray(transactions)) {
        for (let i = 0; i < transactions.length; i++) {
          const transaction = transactions[i];
          if(groupedTransactions.length == 0) {
            groupedTransactions.push({
              dateCreated:  transaction.dateCreated.substr(0, 7),
              total: transaction.totalPriceWithDiscount,
              totalTransactions: 1
            });
          } else {
            let found = false;

            for (let j = 0; j < groupedTransactions.length; j++) {
              const group = groupedTransactions[j];
              const transactionDate = transaction.dateCreated.substr(0, 7);
              if(group.dateCreated == transactionDate) {
                groupedTransactions[j].total += transaction.totalPriceWithDiscount || 0;
                groupedTransactions[j].totalTransactions ++;
                found = true;
              } 
            }
            if(!found){
              groupedTransactions.push({
                dateCreated: transaction.dateCreated.substr(0, 7),
                total: transaction.totalPriceWithDiscount,
                totalTransactions: 1
              });
            }
          }
          
        }
      }
      return groupedTransactions
    },

    orderByDate(transactions, arrayLength) {
      const orderedTransactions = [];

      for (let i = 0; i < arrayLength; i++) {
        if(orderedTransactions[i]) continue;
          
        orderedTransactions[i] = 0;
        const transaction = transactions[i];
        const arrIndex = transaction?.dateCreated?.substr(6, 7) || transaction?.month?.substr(6, 7) || undefined;
        orderedTransactions[Number(arrIndex) -1] = transaction;
      }
      return orderedTransactions;
    },

    async getMerchantStats(){
      const startDate = new Date(new Date().getFullYear(), 0, 1).toISOString().substr(0, 10);
      const endDate = new Date(new Date().getFullYear(), 12 , 0).toISOString().substr(0, 10);
      await this.getMerchantStatistics({ merchantName: this.selectedMerchant, startDate, endDate });
      await this.getTransactions({ merchantName: this.selectedMerchant, startDate, endDate })
      this.setTransactionChart();
      this.setPaymentMethodChart();
      this.setDeliveryCountChart();
    }
  }
};
</script>

<style scoped>
</style>