<template>
  <Layout>
    <PageHeader :title="title" :items="items" />

    <b-modal
    title="Add New Merchant"
    title-class="text-black font-18"
    v-model="isUserDialogOpen"
    @ok.prevent="saveMerchant"
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
          v-model="newMerchant.merchantId"
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
          v-model="newMerchant.name"
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
          v-model="newMerchant.email"
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
          v-model="newMerchant.address"
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
          v-model="newMerchant.country"
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
          v-model="newMerchant.province"
          >
            <template #first>
              <b-form-select-option :value="null" disabled>-- Please select an option --</b-form-select-option>
            </template>

            <b-form-select-option v-for="province in provinces" :value="province" :key="province">
              {{ province }}
            </b-form-select-option>
          </b-form-select>
        </b-form-group>

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
              v-model="newMerchant.startDate"
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
                v-model="newMerchant.endDate"
                type="date"
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
              v-model="newMerchant.statementFrequencyInWeeks"
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
            value="true"
            unchecked-value="false"
            v-model="newMerchant.isActive"
          >
            Is Account Active ?
          </b-form-checkbox>
        </div>
      </b-form>
    </b-modal>

    <div class="row mb-4">
      <div class="col">
        <b-button variant="primary" @click="isUserDialogOpen=true">
          Add Merchant
        </b-button>
      </div>
    </div>

    <DataTable
    title="Merchant Information"
    subtitle="This table shows information about each merchant"
    :headers="headers"
    :items="allMerchants"
    />
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

    this.getProvinces(this.newMerchant?.country);
  },

  data() {
    return {
      isUserDialogOpen: false,
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
      ],

      tableItems: [],
      newMerchant: {
        country: 'Jamaica'
      },
    };
  },
  
  computed: {
    ...mapState('merchantModule', ['allMerchants'])
  },

  methods: {
    ...mapActions('merchantModule', ['createMerchant', 'getMerchants']),

    async saveMerchant(){
      this.newMerchant.statementFrequencyInWeeks = Number(this.newMerchant.statementFrequencyInWeeks)
      const result = await this.createMerchant(this.newMerchant);
      if (result.status == 201) {
        this.closeModal();
      }
    },

    closeModal(){
      this.newMerchant = {
        country: "Jamaica"
      }
      this.modal.hide();
    }
  },

  watch: {
    'newMerchant.country'(){
      this.getProvinces(this.newMerchant?.country);
    }
  }
};
</script>