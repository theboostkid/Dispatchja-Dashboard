
<template>
  <Layout>
    <PageHeader :title="title" :items="items" />

    <b-modal 
      ref="breakdownModal" 
      size="xl"
      title="Statement Breakdown"
      hide-footer
    >
      <div class="row">
        <div class="col">
          <DataTable
          title="Delivery Transaction Statement"
          :title-class="['d-flex', 'justify-content-center']"
          subtitle="This table shows a breakdown of the delivery transactions"
          :headers="headers"
          :items="selectedStatementTransactions"
          >
            <template #total="{ item }">
              {{ formatAsMoney(item.totalCardTransactions + item.totalCashTransactions) }}
            </template>
          
            <template #jobStatus="{ item }">
              {{ decipherStatusCode(item.jobStatus) }}
            </template>

            <template #dateCreated="{ item }">
              {{ new Date(item.dateCreated).toISOString().substr(0, 10)}}
            </template>

            <template #totalWithoutDeliveryFeeAndDiscount="{ item }">
              {{ formatAsMoney(item.totalWithoutDeliveryFeeAndDiscount) }}
            </template>

            <template #deliveryFee="{ item }">
              {{ formatAsMoney(item.deliveryFee) }}
            </template>
          </DataTable>
        </div>
      </div>
    </b-modal>

    <div class="row mb-4" :class="{ 'text-white': leftSidebarType == 'dark', 'text-dark' : leftSidebarType == 'light' }"> 
      <div class="col-3">
        <div>
          <label class="mt-3">Date Range:</label>
           <date-picker 
            v-model="filters.date" 
            range 
            append-to-body 
            lang="en" 
            confirm
            value-type="YYYY-MM-DD"
            @change="fetchData"
          />
        </div>
      </div>

      <div class="col-3" v-if="currentUser.role != 'restaurant-staff' && currentUser.role != 'restaurant-admin'">
        <label class="mt-3">Filter Merchant:</label>
        <multiselect 
          v-model="filters.merchant" 
          :options="merchants"
          id="input-5"
          type="text"
          :taggable="false"
          :optionHeight="20"
          track-by="_id"
          label="name"
          :allowEmpty="true"
          @input="fetchData"
        >
          <!-- <template #tag>
            <span></span>
          </template> -->

          <!-- <template #selection="{ values, isOpen }">
            <span class="multiselect__single" v-if="values.length &amp;&amp; !isOpen">{{ values.length }} merchants selected</span>
            
            <span @click="clearFilters" v-if="selectedMerchants.length > 0" style="position: absolute; right: 15px; top: 10px; cursor: pointer; z-index: 5;">
              <i class="mdi mdi-close-thick"/>
            </span>
          </template> -->
        </multiselect>
      </div>

      <!--Search Field-->
      <!-- <div class="col-4 pt-4 ms-auto">
        <div class="search-box me-2 mt-3 ">
            <div class="position-relative">
              <input
                type="text"
                class="form-control border-1"
                placeholder="Search..."
                @input="searchFilter($event)"
                :disabledDates="[]"
              />
              <i class="bx bx-search-alt search-icon"></i>
            </div>
          </div>
      </div> -->
    </div>

    <template v-if="statements.length > 0">
      <div class="row mt-5 pt-2">
        <template v-for="statement in statements" >
          <div class="col-md-4" v-if="statement.merchant.name" :key="statement.merchant.name">
            <div class="card">
              <div class="row">
          
                <div class="col-xl-6">
                  <div class="text-center py-5 border-end">
                    <div class="avatar-sm mx-auto mb-3 mt-1">
                      <span
                        :class="`avatar-title rounded-circle text-black font-size-16`"
                      >{{ statement.merchant.name.charAt(0) }}</span>
                    </div>
                    <h5 class=" pb-1">{{statement.merchant.name }}</h5>
                    <h6>Statement:</h6>
                    <h6>
                      {{ new Date(statement.startDate).toDateString().split(' ').slice(1).join(' ') }} - 
                      {{ new Date(statement.dateCreated).toDateString().split(' ').slice(1).join(' ')  }}
                    </h6>
                  </div>
                </div>
                <div class="col-xl-5">
                  <div class="p-4 text-center text-xl-start">
                    <div class="row">
                      <div class="col-xs-6 mb-3">
                        <div>
                          <p class="text-muted mb-2 text-truncate">Subtotal</p>
                          <h5> {{ formatAsMoney((statement.totalCashTransactions + statement.totalCardTransactions)) }}</h5>
                        </div>
                      </div>

                      <div class="col-xs-6 mb-3">
                        <div>
                          <p class="text-muted mb-2 text-truncate">Delivery Fees</p>
                          <h5>{{ formatAsMoney(statement.totalDeliveryFee) }}</h5>
                        </div>
                      </div>

                      <div class="col-xs-6">
                        <div>
                          <span class="text-muted mb-2 text-truncate">Total</span>
                          <h5>{{ formatAsMoney((statement.totalCashTransactions + statement.totalCardTransactions) - statement.totalDeliveryFee) }}</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-12">
                  <div class="my-2 text-center">
                    <a @click.prevent="showModal(statement)" class="text-decoration-underline text-reset">See Profile<i class="mdi mdi-arrow-right"></i></a>
                  </div>
                </div>
              </div>
          
            </div>
          </div>
        </template>
      </div>
      
      <!-- Pagination --> 
      <div class="row">
        <div class="col-lg-12">
          <ul
            class="pagination pagination-rounded justify-content-center mt-2 mb-5"
          >
            <li class="page-item disabled">
              <a href="#" class="page-link">
                <i class="mdi mdi-chevron-left"></i>
              </a>
            </li>
            <li @click="paginate(page)" class="page-item" :class="{ 'active': page == pagination.page } " v-for="page in totalPages" :key="page">
              <a href="#" @click.prevent class="page-link">{{ page }}</a>
            </li>
            <li class="page-item">
              <a href="#" class="page-link">
                <i class="mdi mdi-chevron-right"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <!-- end ro w -->
    </template>
      
    <template v-else>
      <div class="row py-5 justify-content-center align-items-center">
        <div class="col-6 py-5 text-center"  :class="{ 'text-white': leftSidebarType == 'dark', 'text-dark' : leftSidebarType == 'light' }">
            <div class="my-4">
              <i href="#" class="fas fa-file-excel" style="font-size: 70px;"></i>
            </div>
            <h4 class="my-4"  :class="{ 'text-white': leftSidebarType == 'dark', 'text-dark' : leftSidebarType == 'light' }">No Invoices</h4>
        </div>
      </div>
    </template>
  </Layout>
</template>
<script>
import Layout from "../../layouts/horizontal.vue";
import PageHeader from "@/components/page-header";
import { mapActions, mapState } from 'vuex';
import DataTable from '@/components/tables/data-table.vue'
import Multiselect from "vue-multiselect";
import { layoutComputed } from '../../../state/helpers'
import { TransactionService } from '../../../services/transaction.service'

const transactionService = new TransactionService();
/**
 * Starter component
 */
export default {
  page: {
    title: "Statements",
    meta: [{ name: "description", content: 'merchant statement' }]
  },

  components: { 
    Multiselect,
    Layout, 
    PageHeader, 
    DataTable,
  },
  
  data() {
    return {
      title: "Statements",
      items: [
        {
          text: "statements",
          active: true
        }
      ],

      pagination: {
        itemsPerPage: 6,
        page: 1
      },

      datePickeri18n: {
        "night": "Night",
        "nights": "Nights",
        "week": "week",
        "weeks": "weeks",
        "day-names": ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"],
        "check-in": "Start  Date",
        "check-out": "End Date",
        "month-names": [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ],
        "tooltip": {
            "halfDayCheckIn": "Available CheckIn",
            "halfDayCheckOut": "Available CheckOut",
            "saturdayToSaturday": "Only Saturday to Saturday",
            "sundayToSunday": "Only Sunday to Sunday",
            "minimumRequiredPeriod": "%{minNightInPeriod} %{night} minimum.",
        },
      },

      headers: [
        {
          label: 'Date',
          key: 'dateCreated'
        },
        {
          label: 'Order ID',
          key: 'orderId'
        },
        {
          label: 'Merchant Name',
          key: 'merchantName'
        },
        {
          label: 'Customer Name',
          key: 'clientName'
        },
        {
          label: 'Payment Method',
          key: 'paymentMethod'
        },
        {
          label: 'Delivery Fee',
          key: 'deliveryFee'
        },
        {
          label: 'Subtotal',
          key: 'totalWithoutDeliveryFeeAndDiscount'
        },
        {
          label: 'Total',
          key: 'total'
        },
        {
          label: 'Status',
          key: 'jobStatus'
        }
      ],
      tableItems: [],
      selectedStatement: {},
      selectedStatementTransactions: [],
      filters: {
        date: [],
        merchant: '',
      }
    };
  },

  mounted(){
    const startDate = new Date(new Date().getFullYear(), 0, 1).toISOString().substr(0, 10);
    const endDate = new Date(new Date().getFullYear(), 12 , 0).toISOString().substr(0, 10);
    this.filters.date = [startDate, endDate];
    this.fetchData();
  },

  computed: {
    ...mapState('merchantModule', ['merchants']),
    ...mapState('transactionModule', ['transactions', 'statements']),
    ...mapState('auth', ['currentUser']),
    
    ...layoutComputed,

    totalPages: function () {
      return Math.ceil(this.statements.length / this.pagination.itemsPerPage)
    },

  },
  methods: {
    ...mapActions('merchantModule', ['fetchMerchants']),
    ...mapActions('transactionModule', ['fetchTransactions', 'fetchStatements']),

    async fetchData(){
      this.fetchStatements({ startDate: this.filters.date[0], endDate: this.filters.date[1], merchantId: this.filters.merchant?._id});
      await this.fetchMerchants();
      await this.fetchTransactions({startDate: this.filters.date[0], endDate: this.filters.date[1] });
    },
    
    paginate(nextPageNum) {
      this.pagination.page = nextPageNum;
    },

    async showModal(statement){
      const { data, status } = await transactionService.fetchTransactions(statement.startDate.substr(0, 10), statement.endDate.substr(0, 10), statement.merchant.name);
      console.log(statement);
      if(status == 200) {
        this.selectedStatementTransactions = data
      }
      this.$refs['breakdownModal'].show()
    },

    decipherStatusCode(code){
      if(code == 1){
        return 'Started'
      }

      if(code == 2){
        return 'Successfull'
      }

      if(code == 3){
        return 'Failed'
      }

      if(code == 4){
        return 'InProgress/Arrived'
      }

      if(code == 6) {
        return 'Unassigned'
      }

      if(code == 8) {
        return 'Decline'
      }

      if(code == 9) {
        return 'Cancel'
      }

      if(code == 10) {
        return 'Deleted'
      }
    },

    clearFilters(){
      this.selectedMerchants=[];
    }
  },
};

</script>

<style >
  .multiselect__option--highlight:after {
    color: #333133 !important;
  }

  .multiselect__option--highlight{
    color: #333133 !important;
  }

</style>