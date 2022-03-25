
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
          :items="filteredTransactions"
          >
          
            <template #jobStatus="{ item }">
              {{ decipherStatusCode(item.jobStatus) }}
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
            @confirm="filterByDate"
          />
        </div>
      </div>

      <div class="col-9">
        <label class="mt-3">Filter Merchant:</label>
        <multiselect 
          v-model="selectedMerchants" 
          :options="restaurantOptions"
          :multiple="true"
          id="input-5"
          type="text"
        />
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
        <template v-for="statistic in filteredStatements" >
          <div class="col-md-4" v-if="statistic.restaurantName" :key="statistic.restaurantName">
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
                        :class="`avatar-title rounded-circle bg-soft bg-blue text-blue font-size-16`"
                      >{{ statistic.restaurantName.charAt(0) }}</span>
                    </div>
                    <h5 class=" pb-1">{{ statistic.restaurantName }}</h5>
                    <h6>Statement: <span class="btn-link">#12930</span></h6>
                  </div>
                </div>
                <div class="col-xl-5">
                  <div class="p-4 text-center text-xl-start">
                    <div class="row">
                      <div class="col-xs-6 mb-3">
                        <div>
                          <p class="text-muted mb-2 text-truncate">Subtotal</p>
                          <h5> {{ formatAsMoney(statistic.totalWithoutDeliveryFeeAndDiscount) }}</h5>
                        </div>
                      </div>

                      <div class="col-xs-6 mb-3">
                        <div>
                          <p class="text-muted mb-2 text-truncate">Delivery Fees</p>
                          <h5>{{ formatAsMoney(statistic.totalDeliveryFee) }}</h5>
                        </div>
                      </div>

                      <div class="col-xs-6">
                        <div>
                          <span class="text-muted mb-2 text-truncate">Total</span>
                          <h5>{{ formatAsMoney(statistic.totalCardTransactions + statistic.totalCashTransactions) }}</h5>
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
            <p class="text-muted">Please select "Add Invoices" to begin adding invoices to this list</p>
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
          key: 'restaurantName'
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
    const startDate = new Date(new Date().getFullYear() - 2, 0, 1).toISOString().substr(0, 10);
    const endDate = new Date(new Date().getFullYear(), 12 , 0).toISOString().substr(0, 10);
    if(this.restaurantOverallMonthlyStatistics.length < 1){
      await this.getRestaurantStatistics({ startDate, endDate });
    }
    if(this.overallTransactions.length < 1){
      await this.getTransactions({ startDate, endDate });
    }
  },

  computed: {
    ...mapState('restaurantModule', ['restaurantIndividualBreakdownStatistics', 'restaurantOverallMonthlyStatistics']),
    ...mapState('transactionModule', ['overallTransactions']),
  
    totalPages: function () {
      return Math.ceil(this.restaurantIndividualBreakdownStatistics.length / this.pagination.itemsPerPage)
    },

    restaurantOptions: function(){
      return this.restaurantIndividualBreakdownStatistics.map((stat) => stat.restaurantName).filter(Boolean)
    },


    filteredStatements: function(){
      return this.restaurantIndividualBreakdownStatistics.filter(item => {
        if(this.selectedMerchants.length > 0){
          if(this.selectedMerchants.includes(item.restaurantName)){
            return item;
          }
        }
        else{
          return item
        }
      })
    },
    
    paginatedItems: function(){
      return []
    },

    filteredTransactions: function(){
      return this.overallTransactions.filter( transaction=> transaction.restaurantName == this.selectedStatement.restaurantName)
    }
  },

  methods: {
    ...mapActions('restaurantModule', ['getRestaurantStatistics']),
    ...mapActions('transactionModule', ['getTransactions']),
    
    paginate(nextPageNum) {
      this.pagination.page = nextPageNum;
    },

    showModal(stats){
      this.selectedStatement = stats;
      this.$refs['breakdownModal'].show()
    },

    filterByDate(){
      console.log(this.daterange);
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
    }
  }
};

</script>