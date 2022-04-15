<template>
  <div class="card " :class="themeClass">
    <div class="card-body">
      <h5 class="card-title" :class="themeClass"> {{ title }} </h5>
      <p class="font-weight-light text-muted mb-4">{{ subtitle }}</p>
      
      <slot name="header"/>

      <div class="row">
        <div class="col-2">
          Show
          <select v-model="pagination.itemsPerPage" class="px-1 mb-2">
            <option>5</option>
            <option>15</option>
            <option>20</option>
            <option>45</option>
          </select>
          Entries
        </div>
      </div>
      
      <div class="row">
        <div class="col-12">
          <b-table
            :items="paginatedItems"
            :fields="headers"
            fixed
            :class="themeClass"
          >
            <template v-for="header in headers" v-slot:[`cell(${header.key})`]="data">
              <slot :name="header.key" v-bind:item="data.item">
                {{ data.value }}
              </slot>
            </template>

            <template v-slot:empty>
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
          </b-table>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="dataTables_paginate paging_simple_numbers float-end">
            <ul class="pagination pagination-rounded mb-0">
              <!-- pagination -->
              <b-pagination 
                v-model="pagination.page" 
                :total-rows="items.length" 
                :per-page="Number(pagination.itemsPerPage)"
                @change="paginate"
              />
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { layoutComputed } from '../../state/helpers'

  export default {
    props: {
      title: String,
      subtitle: String,
      items: Array,
      headers: Array
    },

    data(){
      return {
        pagination: {
          itemsPerPage: 5,
          page: 1,
          skip: 0,
        }
      }
    },

    // beforeMount(){
    //   console.log(this.items);
    // },

    computed: {
      paginatedItems(){
        if(Array.isArray(this.items)) {
          return this.items.slice(this.pagination.skip, this.pagination.skip + Number(this.pagination.itemsPerPage))
        } else {
          return []
        }
      },

      ...layoutComputed
    },

    methods: {
      paginate( page ) {
        this.pagination.skip = (page * Number(this.pagination.itemsPerPage)) - Number(this.pagination.itemsPerPage);
      }
    },

    watch: {
      items(newVal){
        if(newVal){
          this.pagination.skip = 0;
        }
      },

      'pagination.itemsPerPage'(newVal){
        if(newVal){
          this.pagination.skip = 0;
          this.pagination.page = 1;
        }
      }
    }
  }
</script>

<style scoped>
  .page-item {
    color: #333133;
  }
</style>