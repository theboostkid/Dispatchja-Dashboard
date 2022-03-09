<template>
  <Layout>
    <PageHeader :title="title" :items="items" />

     <div class="row mb-4">
      <div class="col">
        <b-button variant="primary">
          Add User
        </b-button>
      </div>
    </div>

    <div class="row">
      <div
        v-for="user in userGridData"
        :key="user.id"
        class="col-xl-3 col-sm-6"
      >
        <div class="card text-center">
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
          <div class="card-body">
            <div v-if="!user.image" class="avatar-sm mx-auto mb-4">
              <span
                class="avatar-title rounded-circle bg-soft bg-primary text-primary font-size-16"
                >{{ user.name.charAt(0) }}</span
              >
            </div>
            <div v-if="user.image" class="mb-4">
              <img
                class="rounded-circle avatar-sm"
                :src="`${user.image}`"
                alt
              />
            </div>
            <h5 class="font-size-15 mb-1">
              <a href="javascript: void(0);" class="text-dark">{{
                user.name
              }}</a>
            </h5>
            <p class="text-muted">{{ user.email }}</p>
            <p class="text-dark">{{ user.userType }} </p>
          </div>
          <div class="card-footer bg-transparent border-top">
            <div class="row">
              <div class="col">
                Last Active: 
                <div>
                  {{ user.lastActive }}
                </div>
              </div>
              <div class="col">
                Last Login: 
                <div>
                  {{ user.lastLogin }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
</Layout>
</template>

<script>
import Layout from "../../layouts/horizontal.vue";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import { mapActions } from 'vuex'

/**
 * Starter component
 */
export default {
  page: {
    title: "Starter Page",
    meta: [{ name: "description", content: appConfig.description }]
  },

  components: { Layout, PageHeader },

  data() {
    return {
      title: "Users",
      items: [
        {
          text: "Users",
          active: true
        }
      ],

      userGridData: [
        {
            id: 1,
            name: 'David McHenry',
            email: 'david@skote.com',
            userType: 'UI/UX Designer',
            lastLogin: '5/5/2022',
            lastActive: '5/5/2022'
        },
        {
            id: 2,
            name: 'Frank Kirk',
            email: 'frank@skote.com',
            userType: 'Frontend Developer',
            lastLogin: '5/5/2022',
            lastActive: '5/5/2022'
        },
        {
            id: 3,
            name: 'Rafael Morales',
            email: 'Rafael@skote.com',
            userType: 'Backend Developer',
            lastLogin: '5/5/2022',
            lastActive: '5/5/2022'
        },
        {
            id: 4,
            name: 'Mark Ellison',
            email: 'mark@skote.com',
            userType: 'Full Stack Developer',
            lastLogin: '5/5/2022',
            lastActive: '5/5/2022'
        },
        {
            id: 5,
            name: 'Minnie Walter',
            email: 'minnie@skote.com',
            userType: 'Frontend Developer',
            lastLogin: '5/5/2022',
            lastActive: '5/5/2022'
        },
        {
            id: 6,
            name: 'Shirley Smith',
            email: 'shirley@skote.com',
            userType: 'UI/UX Designer',
            lastLogin: '5/5/2022',
            lastActive: '5/5/2022'
        },
        {
            id: 7,
            name: 'John Santiago',
            email: 'john@skote.com',
            userType: 'Full Stack Developer',
            lastLogin: '5/5/2022',
            lastActive: '5/5/2022'
        },
        {
            id: 8,
            name: 'Colin Melton',
            email: 'colin@skote.com',
            userType: 'Backend Developer',
            lastLogin: '5/5/2022',
            lastActive: '5/5/2022'
        },
      ],

      pagination: {
        itemsPerPage: 6,
        page: 1
      },
    };
  },

  beforeMount() {
    this.getUsers();
  },

  methods: {
    ...mapActions('users', ['getUsers'])
  }
};
</script>
