<template>
  <Layout>
    <PageHeader :title="title" :items="items" />

    <b-modal
    :title="(dialogMode == 'add' ? 'Add New' : 'Edit') + '  Merchant'"
    title-class="text-black font-18"
    v-model="isModalOpen"
    @ok.prevent="saveMerchant"
    @cancel="closeModal"
    >
      <b-form>
        <b-form-group
        label="Tookan Id"
        id="input-group-1"
        class="mb-3"
        label-for="input-1"
        >
          <b-form-input
          id="input-1"
          v-model="merchantInfo.merchantId"
          type="text"
          />
        </b-form-group>

        <b-form-group
        label="Name"
        id="input-group-2"
        class="mb-3"
        label-for="input-2"
        >
          <b-form-input
          id="input-2"
          v-model="merchantInfo.name"
          type="text"
          />
        </b-form-group>

        <b-form-group
        label="Email"
        id="input-group-3"
        class="mb-3"
        label-for="input-3"
        >
          <b-form-input
          id="input-3"
          v-model="merchantInfo.email"
          type="email"
          />
        </b-form-group>

        <b-form-group
        label="Street Address"
        id="input-group-4"
        class="mb-3 form-label"
        label-for="input-4"
        >
          <b-form-input
          id="input-2"
          v-model="merchantInfo.address"
          type="text"
          />
        </b-form-group>

        <b-form-group
        label="Country"
        id="input-group-5"
        class="mb-3 form-label"
        label-for="input-5"
        >
          <b-form-select
          id="input-5"
          class="form-select"
          v-model="merchantInfo.country"
          >
            <template #first>
              <b-form-select-option :value="null" disabled>-- Please select an option --</b-form-select-option>
            </template>

            <b-form-select-option v-for="country in countries" :value="country.name" :key="country.name">
              {{ country.name }}
            </b-form-select-option>
          </b-form-select>
        </b-form-group>

        <b-form-group
        label="Province"
        id="input-group-6"
        class="mb-3 form-label"
        label-for="input-6"
        >
          <b-form-select
          id="input-6"
          class="form-select"
          v-model="merchantInfo.province"
          >
            <template #first>
              <b-form-select-option :value="null" disabled>-- Please select an option --</b-form-select-option>
            </template>

            <b-form-select-option v-for="province in provinces" :value="province" :key="province">
              {{ province }}
            </b-form-select-option>
          </b-form-select>
        </b-form-group>

        <div class="row" v-if="dialogMode != 'edit'">
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
                />
              </b-form-group>
          </div>
        </div>

        <div class="row" v-if="dialogMode != 'edit'">
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

        <div class="col-12 mb-3">
          <b-form-checkbox
            class="form-check"
            id="customControlInline"
            name="checkbox-1"
            v-model="merchantInfo.isActive"
          >
            Is Account Active ?
          </b-form-checkbox>
        </div>
      </b-form>
    </b-modal>

    <div class="row mb-4">
      <div class="col">
        <b-button variant="primary" @click="openAddDialog">
          Add Merchant
        </b-button>
      </div>
    </div>

    <DataTable
    title="Merchant Information"
    subtitle="This table shows information about each merchant"
    :headers="headers"
    :items="allMerchants"
    >
      <template #actions="{ item }">
        <div class="row">
          <div class="col-xl-3 col-lg-4 col-sm-6" @click="removeMerchant(item)">
            <i class="mdi mdi-18px mdi-delete"></i>
          </div>
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
import CountriesMixin from  "../../../../mixins/countries.mixin"
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

  mixins: [CountriesMixin],
  
  async beforeMount() {
    await this.getMerchants();

    if(this.countries.length < 1) 
      await this.loadCountries();

    this.getProvinces(this.merchantInfo?.country);
  },

  data() {
    return {
      dialogMode: 'add',
      isModalOpen: false,
      title: "Merchants",
      items: [
        {
          text: "Settings"
        },
        {
          text: "Merchants",
          active: true
        }
      ],
      headers:[
        {
          label: "Id",
          key: "merchantId"
        },
        {
          label: "Merchant Name",
          key: "name"
        },
        {
          label: "Email",
          key: "email"
        },
        {
          label: "Merchant Location",
          key: "address"
        },
        {
          label: "Province",
          key: "province"
        },
        {
          label: "Country",
          key: "country"
        },
        {
          label: "Actions",
          key: "actions"
        },
      ],

      tableItems: [],
      merchantInfo: {
        country: 'Jamaica'
      },
    };
  },
  
  computed: {
    ...mapState('merchantModule', ['allMerchants'])
  },

  methods: {
    ...mapActions('merchantModule', ['createMerchant', 'getMerchants', 'updateMerchant', 'deleteMerchant']),

    async saveMerchant(){
      this.merchantInfo.statementFrequencyInWeeks = Number(this.merchantInfo.statementFrequencyInWeeks);
      if(this.dialogMode == 'add'){
        const result = await this.createMerchant(this.merchantInfo);
        if (result.status == 201) {
          this.closeModal();
        }
      } else if (this.dialogMode == 'edit'){
        const result = await this.updateMerchant(this.merchantInfo);
        if(result.status == 200){
          this.closeModal();
        }
      }
    },

    openAddDialog(){
      this.isModalOpen = true;
      this.dialogMode = 'add';
    },

    openEditDialog(merchantInfo){
      this.dialogMode = 'edit'
      this.merchantInfo = { ...merchantInfo };
      this.merchantInfo.startDate = this.merchantInfo.lastStatementDate;
      this.merchantInfo.endDate = this.merchantInfo.nextStatementDate;
      this.isModalOpen = true;
    },
    
    closeModal(){
      this.merchantInfo = {
        country: "Jamaica"
      }
      this.isModalOpen = false
    },

    async removeMerchant(merchantInfo){
      await this.deleteMerchant(merchantInfo.id);
    }
  },

  watch: {
    'merchantInfo.country'(){
      this.getProvinces(this.merchantInfo?.country);
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