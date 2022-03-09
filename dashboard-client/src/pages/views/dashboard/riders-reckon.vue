<template>
  <Layout class="clearfix" >
    <PageHeader :title="title" :items="items" />
    
    

    <div class="row mb-5">
      <div class="col-12">
        <DataTable
          title="Agent Transactions"
          subtitle="This table shows all the transaction carried out by the various agents employed by your company"
          :headers="tableHeaders"
          :items="tableItems"
        >
        
          <template #header>
            <div class="row justify-content-end mb-4"> 
              <div class="col-3">
                <div class="mb-4">
                  <label class="mt-3">Set minnght and maxnight</label>
                  <HotelDatePicker
                    :i18n="datePickeri18n"
                  />
                </div>
              </div>
              <div class="col-3">
                <label class="mt-3">Multiple Select</label>
                <multiselect v-model="filters.agent" :options="agentList" :multiple="true"></multiselect>
              </div>
            </div>
          </template>
        </DataTable>
      </div>
    </div>
  </Layout>
</template>

<script>
import Layout from "../../layouts/horizontal.vue";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import DataTable from "@/components/tables/data-table.vue";
import Multiselect from "vue-multiselect";
import HotelDatePicker from "vue-hotel-datepicker";
import 'vue-hotel-datepicker/dist/vueHotelDatepicker.css';

/**
 * Starter component
 */
export default {
  page: {
    title: "Starter Page",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout, PageHeader, DataTable, Multiselect, HotelDatePicker },
  data() {
    return {
      title: "Agent Reckon",
      items: [
        {
          text: "Agent Reckon",
          active: true
        }
      ],
      tableItems: [],
      tableHeaders: [
        {
          label: "Order ID",
          key: "order_id"
        },
        {
          label: "Merchant Name",
          key: "merchant_name"
        },
        {
          label: "Task Status",
          key: "task_status"
        },
        {
          label: "Cost",
          key: "amount"
        },
        {
          label: "Date",
          key: "date"
        }
      ],
      agentList: [],
      filters: {
        date: "",
        agent: ""
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
      }
    };
  }
};
</script>

<style scoped>
  .clearfix:before,
  .clearfix:after {
      content: ".";    
      display: block;    
      height: 0;    
      overflow: hidden; 
  }
  .clearfix:after { clear: both; }
  .clearfix { zoom: 1; }
</style>