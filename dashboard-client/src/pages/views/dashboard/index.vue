<template>
  <Layout>
    <PageHeader :title="title" :items="items" />

    <div class="row">
      <div class="col-sm-3 col-md-3">
        <WidgetCard
        title="Total Invoices (month)"
        data="150"
        icon="fas fa-file-invoice"
        />
      </div>
      
      <div class="col-sm-3 col-md-3">
        <WidgetCard
        title="Completed Transactions (month)"
        data="120"
        icon="fas fa-file-invoice-dollar"
        />
      </div>
    </div>
    
    
    <div class="row">
      <div class="col-12">
        <LineChart
        title="Transactions"
        subtitle="This graph shows a comparision between transactions that were completed and transactions that failed"
        ref="graphTransactions"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <LineChart
        title="Payment Methods"
        subtitle="This graph shows a comparision between cash transactions, card transactions and transactions completed by online"
        ref="graphPaymentMethods"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <DataTable
        title="Delivery Transactions"
        subtitle="This table shows all the recent deliveries"
        :items="deleveryTableItems"
        :headers="headers"
        />
      </div>
    </div>
  </Layout>
</template>

<script>
import Layout from "../../layouts/horizontal.vue";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import LineChart from "@/components/charts/line-chart.vue"
import WidgetCard from "@/components/widgets/card";
import DataTable from "@/components/tables/data-table.vue"
import { mapActions, mapGetters, mapState } from 'vuex';

/**
 * Starter component
 */
export default {
  page: {
    title: "Starter Page",
    meta: [{ name: "description", content: appConfig.description }]
  },
  
  components: { Layout, PageHeader, LineChart, WidgetCard, DataTable },

  data() {
    return {
      title: "Dashboard",
      items: [
        {
          text: "dashboard",
          active: true
        }
      ],
      click: false,

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
      
      headers: [
        {
          label: "Order Id",
          key: "orderId"
        },
        {
          label: "Order Total",
          key: "orderTotal"
        },
        {
          label: "Ordered By",
          key: "orderBy"
        },
        {
          label: "Delivery Fee",
          key: "deliveryFee"
        },
        {
          label: "Merchant Name",
          key: "merchantName"
        },
        {
          label: "Customer name",
          key: "customerName"
        },
        {
          label: "Status",
          key: "status"
        },
        {
          label: "Actions",
          key: "action"
        }
      ],
      deleveryTableItems: [
      ]
    };
  },

  async mounted(){
    const startDate = new Date(new Date().getFullYear(), 0, 1).toISOString().substr(0, 10);
    const endDate = new Date(new Date().getFullYear(), 12 , 0).toISOString().substr(0, 10);
    
    await this.getTransactions({ startDate, endDate });
    await this.getMerchantStatistics({ startDate, endDate });
    
    this.setDeliveryTable();
    this.setTransactionChart();
    this.setPaymentMethodChart();
  },

  computed: {
    ...mapState('transactionModule', ['allTransactions']),
    ...mapGetters('transactionModule', ['completedTransactions', 'failedTransactions', 'cancelledTransactions']),
    ...mapState('merchantModule', ['overallMerchantPeriodSummaries'])
  },

  methods: {
    ...mapActions('transactionModule', ['getTransactions']),
    ...mapActions('merchantModule', ['getMerchantStatistics']),

    setTransactionChart(){
      const groupedTransactionsCompleted = this.aggregateByDate(this.completedTransactions);
      const groupedTransactionsFailed = this.aggregateByDate(this.failedTransactions);
      const groupedTransactionsCancel = this.aggregateByDate(this.cancelledTransactions);

      const orderedCompletedTransactions = this.orderByDate(groupedTransactionsCompleted, 12);
      const orderedFailedTransactions = this.orderByDate(groupedTransactionsFailed, 12);
      const orderedCancelTransactions = this.orderByDate(groupedTransactionsCancel, 12);
      
    
      const failedSeries = {
        name: 'Failed Transaction',
        color: '#FFA500',
        data: orderedFailedTransactions.map(transaction => transaction.total || 0)
      }

      const completedSeries = { 
        name: 'Completed Transaction', 
        color: "#008000",
        data: orderedCompletedTransactions.map(transaction => transaction.total || 0)
      }

      const cancelledSeries = { 
        name: 'Cancel Transaction', 
        color: "#B22222",
        data: orderedCancelTransactions.map(transaction => transaction.total || 0)
      }

      this.$refs['graphTransactions'].renderChart(this.lineGraphCategories, 'monthly', [ failedSeries, completedSeries, cancelledSeries ])

    },

    setPaymentMethodChart() {
      const orderedMonthlyStatistice = this.orderByDate(this.overallMerchantPeriodSummaries, 12);

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

    setDeliveryTable(){
    
      this.deleveryTableItems = this.allTransactions.map( transaction => { 
        let jobStatus = '';

        if(transaction.jobStatus == 2){
          jobStatus = "Completed"
        } else if(transaction.jobStatus == 3){
          jobStatus = "Failed"
        } else if(transaction.jobStatus == 8){
          jobStatus = "Decline"
        } else if(transaction.jobStatus == 9){
          jobStatus = "Cancel"
        }
        return {
          orderId: transaction.orderId,
          orderTotal: transaction.totalPriceWithDiscount,
          orderBy: transaction.customerUsername,
          deliveryFee: transaction.deliveryFee,
          merchantName: transaction.merchantName,
          customerName: transaction.clientName,
          status: jobStatus
        }
      });

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
        orderedTransactions[arrIndex -1] = transaction;
      }
      return orderedTransactions;
    }
  }

};
</script>