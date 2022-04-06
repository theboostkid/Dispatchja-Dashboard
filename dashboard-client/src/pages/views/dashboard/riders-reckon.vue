<template>
  <Layout class="clearfix" >
    <PageHeader :title="title" :items="items" />

    <b-modal
    v-model="isViewAgentHistoryDialogOpen"
    size="xl"
    >
      <DataTable
      title="Task History"
      :subtitle="`This table shows the histoy of the task that ${selectedAgent? selectedAgent.name : 'this agent'} has done`"
      :headers="agentTaskHeaders"
      :items="agentTask"
      >
        <template #header>
          <div class="row justify-content-end mb-4">
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
                    @confirm="filterByDate"
                  />
                </div>
              </div>
          </div>
        </template>

        <template #subtotal="{ item }">
          {{ formatAsMoney(item.totalWithoutDeliveryFeeAndDiscount)}}
        </template>

        <template #total="{ item }">
          {{ formatAsMoney(item.totalCardTransactions + item.totalCashTransactions) }}
        </template>

        <template #taskStatus="{ item }">
           {{ decryptJobStatus(item.jobStatus) }}
        </template>
        
        <template #date="{ item }">
          {{ new Date(item.completedDatetime).toISOString().substr(0, 10) }}
        </template>
      </DataTable>
    </b-modal>

    <div class="row mb-5">
      <div class="col-12">
        <DataTable
          title="Agent Transactions"
          subtitle="This table shows all the riders employed by your company"
          :headers="agentHeaders"
          :items="filteredAgent"
        >
        
          <template #header>
            <div class="row justify-content-end mb-4"> 
              <div class="col-3">
                <label class="mt-3">Filter By Agent: </label>
                <multiselect 
                  v-model="filters.agents" 
                  :options="agentList" 
                  :multiple="true" 
                  label="name" 
                  track-by="value"
                  :taggable="false"
                  :optionHeight="20"
                  :preserve-search="true"
                >
                  <template #tag>
                    <span></span>
                  </template>

                  <template #selection="{ values, isOpen }">
                    <span class="multiselect__single" v-if="values.length &amp;&amp; !isOpen">{{ values.length }} Agents selected</span>
                    
                    <span @click="clearFilters" v-if="filters.agents.length > 0" style="position: absolute; right: 15px; top: 10px; cursor: pointer; z-index: 5;">
                      <i class="mdi mdi-close-thick"/>
                    </span>
                  </template>
                </multiselect>
              </div>
            </div>
          </template>

          <template #actions="{ item }">
            <div class="row">
              <div class="actions col" @click="viewAgentTaskHistory(item)">
                <i class="mdi mdi-eye-outline mdi-18px"/>
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
// import appConfig from "@/app.config";
import DataTable from "@/components/tables/data-table.vue";
import Multiselect from "vue-multiselect";
import { mapActions, mapState } from 'vuex';
import DatePicker from "vue2-datepicker";
import 'vue-hotel-datepicker/dist/vueHotelDatepicker.css';

/**
 * Starter component
 */
export default {
  page: {
    title: "Riders Reckon",
    meta: [{ name: "description", content: 'Delivery personnel work history' }]
  },
  
  components: { Layout, PageHeader, DataTable, Multiselect, DatePicker},
  
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
      agentHeaders: [
        {
          label: "Order ID",
          key: "fleetId"
        },
        {
          label: "Agent Name",
          key: "name"
        },
        {
          label: "Agent Email",
          key: "email"
        },
        {
          label: "Phone",
          key: "phone"
        },
        {
          label: "Actions",
          key: "actions"
        },
      ],
      agentTaskHeaders: [
        {
          label: "Order ID",
          key: "jobId"
        },
        {
          label: "Merchant Name",
          key: "merchantName"
        },
        {
          label: "Task Status",
          key: "taskStatus"
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
          label: "Date Completed",
          key: "date"
        }
      ],
      agentTask: [],
      
      filters: {
        date: "",
        agents: []
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
      selectedAgent: {},
      isViewAgentHistoryDialogOpen: false
    };
  },

  async beforeMount(){
    const startDate = new Date(new Date().getFullYear(), 0, 1).toISOString().substr(0, 10);
    const endDate = new Date(new Date().getFullYear(), 12 , 0).toISOString().substr(0, 10);
    await this.getAgents();
    await this.getTransactions({ startDate, endDate });
  },

  computed: {
    ...mapState('agentModule', ['allAgents']),
    ...mapState('transactionModule', ['allTransactions']),

    agentList(){
      return this.allAgents.map( agent => { return { value : agent.fleetId, name: agent.name } })
    },

    filteredAgent(){
      if(this.filters.agents.length > 0){
        return this.allAgents.filter( agent => this.filters.agents.some( val => val.name == agent.name ))
      } else {
        return this.allAgents
      }
    }
  },

  methods: {
    ...mapActions('agentModule', ['getAgents']),
    ...mapActions('transactionModule', ['getTransactions']),

    filterByDate(){

    },

    viewAgentTaskHistory(agent){
      this.selectedAgent = agent;
      this.agentTask = this.allTransactions.filter( transaction => transaction.fleetId == agent.fleetId);
      console.log(this.agentTask); 
      this.isViewAgentHistoryDialogOpen = true;
    },

    decryptJobStatus(status){
      switch(status){
        case 0:
          return 'Assigned' 
        case 1: 
          return 'Started'
        case 2: 
          return 'Successfull'
        case 3:
          return 'Failed'
        case 4:
          return 'InProgress/Arrived'
        case 6:
          return 'Unassigned'
        case 7:
          return 'Accepted/Acknowledged'
        case 8:
          return 'Decline'
        case 9:
          return 'Cancel'
        case 10:
          return 'Deleted'
        default:
          return 'Unkown'
      }
    },

    clearFilters(){
      this.filters = {
        agents: [],
        date: ""
      }
    }
  }
};
</script>

<style scoped>
  .actions:hover{
    color: #FEDB00;
    cursor: pointer;
  }
  
   .multiselect__option--highlight:after {
    color: #333133 !important;
  }

  .multiselect__option--highlight{
    color: #333133 !important;
  }

</style>