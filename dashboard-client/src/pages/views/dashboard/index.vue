<template>
  <Layout>
    <PageHeader :title="title" :items="items" />

    <div class="row mb-4">
      <div class="col-sm-3 col-md-3">
        <label class="mt-3">For The year:</label>
        <date-picker 
          v-model="filters.year" 
          append-to-body 
          lang="en" 
          confirm
          value-type="YYYY-MM-DD"
          type="year"
          :range="false" 
          @change="fetchData"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-sm-3 col-md-3">
        <WidgetCard
        :title="'Total statements ('+ filters.year.toString().substr(0,4) + ')'"
        :data="statementsCount"
        icon="fas fa-file-invoice"
        />
      </div>
      
      <div class="col-sm-3 col-md-3">
        <WidgetCard
        :title="'Completed Transactions ('+ filters.year.toString().substr(0,4) + ')'"
        :data="this.completedTransactions.length"
        icon="fas fa-file-invoice-dollar"
        />
      </div>
    </div>
    
    <div class="row">
      <div class="col-12">
        <LineChart
          title="Period Transactions"
          subtitle="This graph shows a comparision between transactions that were completed and transactions that failed"
          :chartData="transactionData"
          :height="100"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <LineChart
          title="Payment Methods"
          subtitle="This graph shows a comparision between cash transactions, card transactions and transactions completed online"
          :chartData="paymentMethodsData"
          :height="100"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <DataTable
        title="Delivery Transactions"
        subtitle="This table shows all the recent deliveries"
        :items="transactions"
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
import 'vue-hotel-datepicker/dist/vueHotelDatepicker.css';
import { transactionMixin } from '../../../mixins/transaction.mixin'
import { mapState } from 'vuex';

/**
 * Starter component
 */
export default {
  page: {
    title: "Dashboard",
    meta: [{ name: "description", content: appConfig.description }]
  },
  
  components: { Layout, PageHeader, LineChart, WidgetCard, DataTable },
  
  mixins: [transactionMixin],


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
          label: "Merchant Name",
          key: "merchantName"
        },
        {
          label: "Customer Name",
          key: "customerUsername"
        },
        {
          label: "Delivery Fee",
          key: "deliveryFee"
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
          label: "Delivered By",
          key: "fleetName"
        },
        {
          label: "Job Status",
          key: "jobStatus"
        }
      ],
      filters: {
        year: new Date().toISOString().substr(0, 10)
      },

      transactionData: {  
        labels: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
        datasets: [ 
          { 
            label: 'Completed', 
            backgroundColor: "#008000",
            pointRadius: 4,
            pointHoverRadius: 5,
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,]
          },
          {
            label: 'Failed',
            backgroundColor: '#FFA500',
            pointRadius: 4,
            pointHoverRadius: 5,
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,]
          },
          { 
            label: 'Cancelled', 
            backgroundColor: "#B22222",
            pointRadius: 4,
            pointHoverRadius: 5,
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,]
          }
        ], 
      },

      paymentMethodsData: { 
        labels: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ], 
        datasets: [ { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,] } ], 
      },
    };
  },

  mounted(){
    this.fetchData()
  },

  computed: {
    ...mapState('transactionModule', ['statementsCount']),
    
    totalCompletedTransactions(){
      return this.completedTransactions.length.toString()
    },
  },

  methods: {
    async fetchData(){
      const startDate = new Date(this.filters.year.substr(0, 4), 0, 1).toISOString().substr(0, 10);
      const endDate = new Date(this.filters.year.substr(0, 4), 12 , 0).toISOString().substr(0, 10);
      await this.fetchStatistics({ startDate, endDate });
      await this.fetchTransactions({ startDate, endDate });
      
      this.setDeliveryTable();
      this.setTransactionChart();
      this.setPaymentMethodChart();
    },

    setTransactionChart() {
      const failed = {
        label: 'Failed Transactions',
        pointStyle: 'circle',
        pointRadius: 5,
        pointHoverRadius: 6,
        backgroundColor: '#FF007A',
        borderColor: '#660031',
        data: this.failedTransactionPeriodSummary.map(transaction => transaction.total)
      }
      const completed = {
        label: 'Completed Transaction', 
        pointStyle: 'circle',
        pointRadius: 5,
        pointHoverRadius: 6,
        backgroundColor: '#00FF66',
        borderColor: '#006629',
        data: this.completedTransactionPeriodSummary.map(transaction => transaction.total)
      }
      const cancelled = {
        label: 'Cancel Transaction',
        pointStyle: 'circle',
        pointRadius: 4,
        pointHoverRadius: 6, 
        backgroundColor: '#FFA800',
        borderColor: '#7D5200',
        data: this.cancelledTransactionPeriodSummary.map(transaction => transaction.total)
      }

      this.transactionData = { 
        labels: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ], 
        datasets: [failed, completed, cancelled]
      }
    },

    setPaymentMethodChart() {
      const online = {
        label: 'Online',
        backgroundColor: '#FFA500',
        pointRadius: 4,
        pointHoverRadius: 5,
        borderColor: '#660031',
        pointStyle: 'circle',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,]
      }

      const card = {
        label: 'Card', 
        pointStyle: 'circle',
        pointRadius: 4,
        pointHoverRadius: 5,
        backgroundColor: "#008000",
        borderColor: '#006629',
        data: this.orderedPeriodSummary.map( summary => summary.totalCardTransactions)
      }

      const cash = { 
        label: 'Cash', 
        backgroundColor: "#B22222",
        pointRadius: 4,
        pointHoverRadius: 5,
        borderColor: '#7D5200',
        pointStyle: 'circle',
        data: this.orderedPeriodSummary.map( summary => summary.totalCashTransactions)
      }

      this.paymentMethodsData= {
        labels: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ], 
        datasets: [cash, card, online]
      }
    },

    setDeliveryTable(){
    
      this.deleveryTableItems = this.transactions.map( transaction => { 
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
    }
  }

};
</script>