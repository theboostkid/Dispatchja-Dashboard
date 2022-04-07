
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
          :items="selectedStatement.transactions"
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

    <!-- <div class="row mb-4">
      <div class="col">
        <b-button variant="primary">
          Add Invoice
        </b-button>
      </div>
    </div> -->

    <div class="row mb-4"> 
      <div class="col-3">
        <div>
          <label class="mt-3">Date Range:</label>
           <date-picker 
            v-model="daterange" 
            range 
            append-to-body 
            lang="en" 
            confirm
            value-type="YYYY-MM-DD"
          />
        </div>
      </div>

      <div class="col-3">
        <label class="mt-3">Filter Merchant:</label>
        <multiselect 
          v-model="selectedMerchants" 
          :options="merchantOptions"
          :multiple="true"
          id="input-5"
          type="text"
          :taggable="false"
          :optionHeight="20"
        >
          <template #tag>
            <span></span>
          </template>

          <template #selection="{ values, isOpen }">
            <span class="multiselect__single" v-if="values.length &amp;&amp; !isOpen">{{ values.length }} merchants selected</span>
            
            <span @click="clearFilters" v-if="selectedMerchants.length > 0" style="position: absolute; right: 15px; top: 10px; cursor: pointer; z-index: 5;">
              <i class="mdi mdi-close-thick"/>
            </span>
          </template>
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

    <template v-if="filteredStatements.length > 0">
      <div class="row mt-5 pt-2">
        <template v-for="statistic in filteredDateStatements" >
          <div class="col-md-4" v-if="statistic.merchantName" :key="statistic.merchantName">
            <div class="card">
              <div class="row justify-content-end">
                <div class="col-xl-2 d-flex justify-content-end px-4">
                  <b-dropdown
                      variant="white"
                      toggle-class="text-muted p-0"
                      toggle-tag="div"
                    >
                    <template v-slot:button-content>
                      <i class="mdi mdi-dots-horizontal font-size-18"></i>
                    </template>
                    <b-dropdown-item> Edit</b-dropdown-item>
                    <b-dropdown-item> <span class="text-danger">Delete</span> </b-dropdown-item>
                  </b-dropdown>
                </div>
              </div>
              <div class="row">
          
                <div class="col-xl-6">
                  <div class="text-center py-5 border-end">
                    <div class="avatar-sm mx-auto mb-3 mt-1">
                      <span
                        :class="`avatar-title rounded-circle text-black font-size-16`"
                      >{{ statistic.merchantName.charAt(0) }}</span>
                    </div>
                    <h5 class=" pb-1">{{ statistic.merchantName }}</h5>
                    <h6>Statement:</h6>
                    <h6>
                      {{ new Date(statistic.period.startDate).toDateString().split(' ').slice(1).join(' ') }} - 
                      {{ new Date(statistic.period.endDate).toDateString().split(' ').slice(1).join(' ')  }}
                    </h6>
                  </div>
                </div>
                <div class="col-xl-5">
                  <div class="p-4 text-center text-xl-start">
                    <div class="row">
                      <div class="col-xs-6 mb-3">
                        <div>
                          <p class="text-muted mb-2 text-truncate">Subtotal</p>
                          <h5> {{ formatAsMoney(statistic.subtotal) }}</h5>
                        </div>
                      </div>

                      <div class="col-xs-6 mb-3">
                        <div>
                          <p class="text-muted mb-2 text-truncate">Delivery Fees</p>
                          <h5>{{ formatAsMoney(statistic.deliveryFee) }}</h5>
                        </div>
                      </div>

                      <div class="col-xs-6">
                        <div>
                          <span class="text-muted mb-2 text-truncate">Total</span>
                          <h5>{{ formatAsMoney(statistic.total) }}</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-12">
                  <div class="my-2 text-center">
                    <a @click.prevent="showModal(statistic)" class="text-decoration-underline text-reset">See Profile<i class="mdi mdi-arrow-right"></i></a>
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
        <div class="col-6 py-5 text-center">
            <div class="my-4">
              <i href="#" class="fas fa-file-excel" style="font-size: 70px;"></i>
            </div>
            <h4 class="my-4">No Invoices</h4>
        </div>
      </div>
    </template>
  </Layout>
</template>
<script>
import Layout from "../../layouts/horizontal.vue";
import PageHeader from "@/components/page-header";
import { mapActions, mapState } from 'vuex';
import 'vue-hotel-datepicker/dist/vueHotelDatepicker.css';
import DataTable from '@/components/tables/data-table.vue'
import DatePicker from "vue2-datepicker";
import Multiselect from "vue-multiselect";


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
    DatePicker 
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
      daterange: [],
      selectedMerchants: [],
      selectedStatement: {}
    };
  },

  async mounted(){
    await this.getMerchants();
    const startDate = new Date(new Date().getFullYear() - 2, 0, 1).toISOString().substr(0, 10);
    const endDate = new Date(new Date().getFullYear(), 12 , 0).toISOString().substr(0, 10);
    await this.getMerchantStatistics({ startDate, endDate });
    await this.getTransactions({ startDate, endDate });
  },

  computed: {
    ...mapState('merchantModule', ['overallMerchantSummaries', 'overallMerchantPeriodSummaries', 'allMerchants']),
    ...mapState('transactionModule', ['allTransactions']),
  
    totalPages: function () {
      return Math.ceil(this.overallMerchantSummaries.length / this.pagination.itemsPerPage)
    },

    merchantOptions: function(){
      return this.statements.map((stat) => stat.merchantName).filter(Boolean)
    },

    filteredStatements: function(){
      return this.statements.map(item => {
        if(this.selectedMerchants.length > 0){
          if(this.selectedMerchants.includes(item.merchantName)){
            return item.statements;
          }
        }
        else{
          return item.statements
        }
      }) 
      .reduce((prevArr, currArr) => prevArr.concat(currArr).filter(Boolean), [])
    },

    filteredDateStatements: function() {
      if(this.daterange[0] && this.daterange[1]) {
        const filtered = [];
        for (let i = 0; i < this.filteredStatements.length; i++) {
          const statement = this.filteredStatements[i];

          const dateFrom = new Date(this.daterange[0]);
          const dateTo = new Date(this.daterange[1]);
          const checkDate = new Date(statement.period.startDate);
          if(checkDate.getTime() <= dateTo.getTime() && checkDate.getTime() >= dateFrom.getTime()){
            filtered.push(statement)
          }
        }
        return filtered
      } else {
        return this.filteredStatements
      }
    },
    
    statements: function(){
      const merchantStatements = this.allMerchants.map( merchant => {
        const statements = merchant.statements.map(statementPeriod => {
          const merchantName = merchant.name
          const period = { startDate: statementPeriod.startDate, endDate: statementPeriod.endDate }
          let transactions = [];
          let deliveryFee = 0;
          let subtotal = 0;
          let total = 0;

          for (let i = 0; i < this.allTransactions.length; i++) {
            const transaction = this.allTransactions[i];

            const dateFrom = new Date(statementPeriod.startDate);
            const dateTo = new Date(statementPeriod.endDate);
            const checkDate =new Date(transaction.dateCreated.substr(0,10));
            if(checkDate.getTime() <= dateTo.getTime() && checkDate.getTime() >= dateFrom.getTime()){
              subtotal += transaction.totalWithoutDeliveryFeeAndDiscount;
              deliveryFee += transaction.totalDeliveryFee;
              total += transaction.totalCardTransactions + transaction.totalCashTransactions;
              transactions.push( transaction );
            }
          }
          return { merchantName, transactions, deliveryFee, subtotal, total, period}
        })

        return { merchantName: merchant.name, statements }
      });
      return merchantStatements
    },

    paginatedItems: function(){
      return []
    }
  },

  methods: {
    ...mapActions('merchantModule', ['getMerchants','getMerchantStatistics']),
    ...mapActions('transactionModule', ['getTransactions']),
    
    paginate(nextPageNum) {
      this.pagination.page = nextPageNum;
    },

    showModal(stats){
      this.selectedStatement = stats;
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

  watch: {
    filteredStatements(newVal){
      console.log(newVal);
    }
  }
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