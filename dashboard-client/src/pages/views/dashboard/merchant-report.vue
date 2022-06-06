<template>
  <Layout>
    <PageHeader :title="title" :items="items" />

    <div class="row">
      <div class="col-3 mb-5" :class="{ 'text-white': leftSidebarType == 'dark', 'text-dark' : leftSidebarType == 'light' }">
        <label for="merchants" >Please select a merchant</label>
        <multiselect 
          v-model="filters.selectedMerchant" 
          :options="merchants"  
          label="name" 
          track-by="name"
          name="name"
          :taggable="false"
          :optionHeight="20"
          :preserve-search="true"
          deselect-label=""
          :allow-empty="false"
          @input="fetchData"
        />
      </div>

      <div class="col-3 mb-5" :class="{ 'text-white': leftSidebarType == 'dark', 'text-dark' : leftSidebarType == 'light' }">
        <label>For The year:</label>
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
      <div class="col-xl-3">
        <WidgetCard
        :title="'Total Delivery (' + new Date().getFullYear() +')'"
        :data="totalDeliveries"
        icon="fas fa-shipping-fast"
        />
      </div>

      <div class="col-xl-3">
        <WidgetCard
        :title="`Total Deliver Earnings (${new Date(filters.year).getFullYear() + 1})`"
        :data="totalDeliveryEarnings"
        icon="fas fa-money-bill-alt"
        />
      </div>

      <!-- <div class="col-xl-3">
        <WidgetCard
        :title="'Total Credit Card Fees (' + new Date().getFullYear() +')'"
        :data="totalCreditCardFees"
        icon="fas fa-money-check-alt"
        />
      </div> -->
    </div>

    <div class="row">
      <div class="col-lg-6">
        <LineChart
        title="Transactions"
        subtitle="This graph compares transactions that failed and transactions that were successfull"
        :chartData="transactionData"
        :height="200"
        />
      </div>
      
      <div class="col-lg-6">
        <BarChart
        title="Deliveries Count"
        subtitle="This graph shows the total delievers that occurred over the period"
        :chartData="deliveryCountData"
        :height="230"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <LineChart
        title="Payment Methods"
        subtitle="This graph shows a comparison between card and cash sales and the total sales made"
        :chartData="paymentMethodsData"
        :height="100"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <DataTable
        title="Delivery Transaction"
        subtitle="This table shows all the recent deliveries"
        ref="table"
        :headers="headers"
        :items="deliveryTransactions"
        />
      </div>
    </div>
  </Layout>
</template>

<script>
import Layout from "../../layouts/horizontal.vue";
import PageHeader from "@/components/page-header";
// import appConfig from "@/app.config";
import WidgetCard from "@/components/widgets/card"
import LineChart from "@/components/charts/line-chart"
import BarChart from '../../../components/charts/bar-chart.vue';
import DataTable from '../../../components/tables/data-table.vue';
import { mapActions, mapState, mapGetters } from 'vuex';
import Multiselect from "vue-multiselect";
import { layoutComputed } from '../../../state/helpers'
import { transactionMixin } from '../../../mixins/transaction.mixin'

/**
 * Starter component
 */
export default {
  mixins: [transactionMixin],
  page: {
    title: "Reports",
    meta: [{ name: "description", content: 'Reports for each merchant performance' }]
  },
  components: { 
    Layout, 
    PageHeader, 
    WidgetCard, 
    LineChart, 
    BarChart, 
    DataTable,
    Multiselect
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

      deleveryTableItems: [],

      filters: {
        selectedMerchant: "",
        year: new Date().toISOString().substr(0, 10)
      },

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
      
      paymentMethodsData: {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        datasets: [
          {
            label: "Online",
            backgroundColor: "#FFA500",
            pointRadius: 4,
            pointHoverRadius: 5,
            borderColor: "#660031",
            pointStyle: "circle",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          },
          {
            label: "Card",
            backgroundColor: "#008000",
            pointRadius: 4,
            pointHoverRadius: 5,
            borderColor: "#006629",
            pointStyle: "circle",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          },
          {
            label: "Cash",
            backgroundColor: "#B22222",
            pointRadius: 4,
            pointHoverRadius: 5,
            borderColor: "#7D5200",
            pointStyle: "circle",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          },
        ],
      },

      transactionData: {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        datasets: [
          {
            label: "Completed",
            backgroundColor: "#008000",
            pointRadius: 4,
            pointHoverRadius: 5,
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          },
          {
            label: "Failed",
            backgroundColor: "#FFA500",
            pointRadius: 4,
            pointHoverRadius: 5,
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          },
          {
            label: "Cancelled",
            backgroundColor: "#B22222",
            pointRadius: 4,
            pointHoverRadius: 5,
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          },
        ],
      },

      deliveryCountData: {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        datasets: [{
          label: "Delivery Count",
          backgroundColor: "#FFA500",
          borderColor: "#660031",
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        }],
      },
    };
  },

  async beforeMount() {
    await this.fetchMerchants();
  },

  computed: {
    ...layoutComputed,
    
    ...mapState('merchantModule', [
      'merchants', 
      'totalMerchants', 
      'singleMerchantPeriodSummaries', 
      'singleMerchantSummary',
      'overallMerchantPeriodSummaries'
      ]),
    
    ...mapGetters('transactionModule', [ 'completedMerchantTransactions', 'failedMerchantTransactions', 'cancelledMerchantTransactions']),
      
    deliveryTransactions() {
      return this.transactions.filter( transaction => transaction.merchantName == this.filters.selectedMerchant.name)
    },

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
    ...mapActions('merchantModule', ['fetchMerchants']),
    ...mapActions('transactionModule', ['fetchTransactions', 'fetchStatistics', 'fetchStatements']),
    
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

    setDeliveryCountChart() {
      const deliveries = {
        label: "Delivery Count",
        backgroundColor: "#FFA500",
        pointRadius: 4,
        pointHoverRadius: 5,
        borderColor: "#660031",
        pointStyle: "circle",
        data: this.orderedPeriodSummary.map( summary => summary.totalJobs ),
      };

      this.deliveryCountData = {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        datasets: [deliveries],
      };
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
    },

    async fetchData() {
      if(this.filters.selectedMerchant) {
        const startDate = new Date(this.filters.year.substr(0, 4), 0, 1)
          .toISOString()
          .substr(0, 10);
        const endDate = new Date(this.filters.year.substr(0, 4), 12, 0)
          .toISOString()
          .substr(0, 10);
        await this.fetchStatistics({ startDate, endDate, merchantName: this.filters.selectedMerchant.name });
        await this.fetchTransactions({ startDate, endDate, merchantName: this.filters.selectedMerchant.name });
        this.setTransactionChart();
        this.setPaymentMethodChart();
        this.setDeliveryCountChart();
        this.setDeliveryTable();
      }
    },
  }
};
</script>

<style>
  
   .multiselect__option--highlight:after {
    color: #333133 !important;
  }

  .multiselect__option--highlight{
    color: #333133 !important;
  }

</style>