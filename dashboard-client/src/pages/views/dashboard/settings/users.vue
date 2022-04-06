<template>
  <Layout>
    <PageHeader :title="title" :items="items" />

    <b-modal
    :title="(dialogMode == 'add' ? 'Add New' : 'Edit') + ' User'"
    title-class="text-black font-18"
    v-model="isUserDialogOpen"
    @ok.prevent="saveUser"
    @cancel="closeDialog"
    >
      <b-form-group
      label="Tooken Id"
      id="input-group-3"
      class="mb-3"
      label-for="input-3"
      >
        <b-form-input
        id="input-3"
        v-model="userInfo.tookanUserId"
        type="text"
        />
      </b-form-group>

      <b-form>
        <b-form-group
        label="Name"
        id="input-group-1"
        class="mb-3"
        label-for="input-1"
        >
          <b-form-input
          id="input-1"
          v-model="userInfo.name"
          type="text"
          />
        </b-form-group>

        <b-form-group
        label="Email"
        id="input-group-2"
        class="mb-3"
        label-for="input-2"
        >
          <b-form-input
          id="input-2"
          v-model="userInfo.email"
          type="email"
          />
        </b-form-group>

        <b-form-group
        label="Role"
        id="input-group-4"
        class="mb-3 form-label"
        label-for="input-4"
        >
          <b-form-select
          id="input-4"
          class="form-select"
          type="text"
          v-model="userInfo.role"
          :options="userRoles"
          >
            <template #first>
              <b-form-select-option :value="null" disabled>-- Please select an option --</b-form-select-option>
            </template>
          </b-form-select>
        </b-form-group>

        <b-form-group
        label="Merchant Name"
        id="input-group-5"
        class="mb-3 form-label"
        label-for="input-5"
        >
          <b-form-select
          id="input-5"
          class="form-select"
          type="text"
          v-model="userInfo.merchantName"
          :options="selectmerchants"
          >
            <template #first>
              <b-form-select-option :value="null" disabled>-- Please select an option --</b-form-select-option>
            </template>
          </b-form-select>
        </b-form-group>

          <div class="col-12 mb-3">
            <b-form-checkbox
              class="form-check"
              id="customControlInline"
              name="checkbox-1"
              value="true"
              unchecked-value="false"
              v-model="userInfo.isActive"
            >
              Is Account Active ?
            </b-form-checkbox>
          </div>
      </b-form>
    </b-modal>

    <div class="row mb-4">
      <div class="col">
        <b-button variant="primary" @click="openAddUserDialog">
          Add User
        </b-button>
      </div>
    </div>

    <div class="row">
      <div
        class="col-xl-12 col-sm-6"
      >
        
        <DataTable
        :headers="headers"
        :items="users"
        >
          <template #actions="{ item }">
            <div class="row">
              <div class="col-xl-3 col-lg-4 col-sm-6" @click="removeUser(item)">
                <i class="mdi mdi-18px mdi-delete"></i>
              </div>
              <div class="col-xl-3 col-lg-4 col-sm-6" @click="openEditUserDialog(item)">
                <i class="mdi mdi-18px mdi-file-edit-outline"></i>
              </div>
            </div>
          </template>

          <template #isActive="{ item }">
            <span :class=" item.isActive ? 'badge bg-success font-size-13' : 'badge bg-warning font-size-13' " >
              {{ item.isActive ? 'Active' : 'In-Active' }}
            </span>
          </template>

          <template #lastLoginDate="{ item }">
              {{ item.lastLoginDate ? new Date(item.lastLoginDate).toISOString().substr(0, 10) : 'Never' }}
          </template>
        </DataTable>
      </div>
    </div>
</Layout>
</template>

<script>
import Layout from "../../../layouts/horizontal.vue";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import { mapActions, mapState } from 'vuex'
import DataTable from '../../../../components/tables/data-table.vue';
import { notificationMethods } from '../../../../state/helpers'

/**
 * Starter component
 */
export default {
  page: {
    title: "User Settings",
    meta: [{ name: "description", content: appConfig.description }]
  },

  components: { Layout, PageHeader, DataTable },

  data() {
    return {
      dialogMode: 'add',
      title: "Users",
      items: [
        {
          text: "Users",
          active: true
        }
      ],
      pagination: {
        itemsPerPage: 6,
        page: 1
      },
      userRoles: [
        { value: 'superuser', text: 'Super User'},
        { value: 'admin', text: 'Admin'},
        { value: 'restaurant-staff', text: 'merchant Staff'},
        { value: 'restaurant-admin', text: 'merchant Admin'}
      ],
      headers:[
        {
          label: "Status",
          key: "isActive"
        },
        {
          label: "Name",
          key: "name"
        },
        {
          label: "email",
          key: "email"
        },
        {
          label: "role",
          key: "role"
        },
        {
          label: "Last Login",
          key: "lastLoginDate"
        }, 
        {
          label: "Actions",
          key: "actions"
        }
      ],
      isUserDialogOpen: false,
      userInfo: {}
    };
  },

  async beforeMount() {
    await this.getUsers();
    await this.getMerchants();
  },

  computed: {
    ...mapState('userModule', ['users', 'totalUsers']),
    ...mapState('merchantModule', ['allMerchants', 'totalmerchants']),

    totalPages(){
      return Math.ceil(this.totalUsers / this.pagination.itemsPerPage)
    },

    selectmerchants() {
      return this.allMerchants.map((merchant) => {return {value: merchant.name, text: merchant.name }} )
    }
  },

  methods: {
    ...mapActions('userModule', ['getUsers', 'createUser', 'deleteUser', 'updateUser']),
    ...mapActions('merchantModule', ['getMerchants']),
    ...notificationMethods,

    async saveUser() {
      console.log(this.userInfo);
      if(this.dialogMode == 'add') {
        const result = await this.createUser(this.userInfo);

        if(result.status == 201) {
          this.closeDialog();
        } 

      } else if(this.dialogMode == 'edit') {
        const result = await this.updateUser(this.userInfo);
        if(result.status == 200) {
          this.closeDialog();
        } 
      }
    },

    closeDialog(){
      this.userInfo = {}
      this.isUserDialogOpen = false;
    },

    openAddUserDialog(){
      this.dialogMode = 'add';
      this.isUserDialogOpen = true
    },

    openEditUserDialog(user){
      this.dialogMode = 'edit';
      this.userInfo = {...user};
      console.log(this.userInfo);
      this.isUserDialogOpen = true;
    },

    removeUser(user){
      this.deleteUser(user.id);
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
