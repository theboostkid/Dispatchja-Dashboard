<template>
  <Layout>
    <PageHeader :title="title" :items="items" />

    <b-modal 
      title="Update Statement Frequency"
      title-class="text-black font-18"
      v-model="isDialogOpen"
      @ok.prevent="save"
    >
      <div class="card">
        <div class="card-body">
          <b-form>
            <div class="row">
              <div class="col">
                <b-form-group
                label="Start Date"
                id="input-group-7"
                class="mb-3"
                label-for="input-7"
                >
                  <b-form-input
                  id="input-7"
                  v-model="merchantInfo.startDate"
                  type="date"
                  disabled
                  />
                </b-form-group>
              </div>

              <div class="col">
                <b-form-group
                  label="End Date"
                  id="input-group-8"
                  class="mb-3"
                  label-for="input-8"
                  >
                    <b-form-input
                    id="input-8"
                    v-model="merchantInfo.endDate"
                    type="date"
                    disabled
                    />
                  </b-form-group>
              </div>
            </div>

            <div class="row">
              <div class="col-6">
                <b-form-group
                label="Statement Frequency (weeks)"
                id="input-group-9"
                class="mb-3"
                label-for="input-9"
                >
                  <b-form-input
                  id="input-9"
                  v-model="merchantInfo.statementFrequencyInWeeks"
                  type="number"
                  />
                </b-form-group>
              </div>
            </div>
          </b-form>
        </div>
      </div>
    </b-modal>

    <DataTable
    title="Statment Frequency"
    subtitle="This table shows the time span for each statement and when a statment should be genereated by the system"
    :headers="headers"
    :items="allMerchants"
    >
      <template #actions="{ item }">
        <div class="row">
          <div class="col-xl-3 col-lg-4 col-sm-6" @click="openEditDialog(item)">
            <i class="mdi mdi-18px mdi-file-edit-outline"></i>
          </div>
        </div>
      </template>
    </DataTable>
  </Layout>
</template>

<script>
import Layout from "../../../layouts/horizontal.vue";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import DataTable from "@/components/tables/data-table";
import { mapActions, mapState } from 'vuex';

/**
 * Starter component
 */
export default {
  page: {
    title: "Starter Page",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout, PageHeader, DataTable},

  data() {
    return {
      title: "Statment Frequency",
      isDialogOpen: false,
      items: [
        {
          text: "Settings"
        },
        {
          text: "Statement Frequency",
          active: true
        }
      ],
      headers:[
        {
          label: "Merchant Name",
          key: "name"
        },
        {
          label: "Statment Frequency",
          key: "statementFrequencyInWeeks"
        },
        {
          label: "Actions",
          key: "actions"
        }
      ],
      merchantInfo: {}
    };
  },

  async beforeMount(){
    await this.getMerchants()
  },

  computed: {
    ...mapState('merchantModule', ['allMerchants'])
  },

  methods: {
    ...mapActions('merchantModule',  ['getMerchants', 'updateMerchant']),

    openEditDialog(item){
      console.log(item);
      this.merchantInfo = { ...item };
      this.merchantInfo.startDate = this.merchantInfo.statements[this.merchantInfo.statements.length -1].startDate;
      this.merchantInfo.endDate = this.merchantInfo.statements[this.merchantInfo.statements.length -1].endDate;
      this.isDialogOpen = true;
    },

    async save(){
      this.merchantInfo.statementFrequencyInWeeks = Number(this.merchantInfo.statementFrequencyInWeeks);
      const result = await this.updateMerchant(this.merchantInfo);
      if(result.status == 200) {
        this.isDialogOpen = false;
      }
    }
  }
};
</script>

<style scoped>
  .col-sm-6:hover {
    color: #FEDB00;
    cursor: pointer;
  }
</style>