
<template>
  <Layout>
    <PageHeader :title="title" :items="items" />

    <div class="row mb-4">
      <div class="col">
        <b-button variant="primary">
          Add Invoice
        </b-button>
      </div>
    </div>

      <template v-if="invoices.length > 0">
        <div class="row mt-5 pt-2">
          <div class="col-md-4" v-for="invoice in invoices" :key="invoice">
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
                      >J</span>
                    </div>
                    <h5 class=" pb-1">JamWest Company</h5>
                    <h6>Invoice: <span class="btn-link">#12930</span></h6>
                  </div>
                </div>
                <div class="col-xl-5">
                  <div class="p-4 text-center text-xl-start">
                    <div class="row">
                      <div class="col-xs-6">
                        <div>
                          <p class="text-muted mb-2 text-truncate">Delivery Fees</p>
                          <h5>$1000</h5>
                        </div>
                      </div>
                      <div class="col-xs-6">
                        <div>
                          <p class="text-muted mb-2 text-truncate">Subtotal</p>
                          <h5>$1000</h5>
                        </div>
                      </div>
                      <div class="col-xs-6">
                        <div>
                          <span class="text-muted mb-2 text-truncate">Total</span>
                          <h5>$2000</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-12">
                  <div class="my-2 text-center">
                    <a href="#" class="text-decoration-underline text-reset">See Profile<i class="mdi mdi-arrow-right"></i></a>
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
import appConfig from "@/app.config";

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
      title: "Invoices",
      items: [
        {
          text: "invoices",
          active: true
        }
      ],

      pagination: {
        itemsPerPage: 6,
        page: 1
      },
      invoices: [1, 2, 3, 4, 5, 6]
    };
  },

  computed: {
    totalPages: function () {
      console.log(this.invoices);
      return Math.ceil(this.invoices.length / this.pagination.itemsPerPage)
    }
  },

  methods: {
    paginate(nextPageNum) {
      this.pagination.page = nextPageNum;
    }
  }
};

</script>