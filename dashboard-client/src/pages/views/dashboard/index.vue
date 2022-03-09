<template>
  <Layout>
    <PageHeader :title="title" :items="items" />

    <div class="row">
      <div class="col-sm-3 col-md-3">
        <WidgetCard
        title="Total Invoices (month)"
        data="150"
        icon="fas fa-file-invoice"
        />
      </div>

      <div class="col-sm-3 col-md-3">
        <WidgetCard
        title="Outstanding Invoices (month)"
        data="120"
        icon="fas fa-file-invoice-dollar"
        />
      </div>

      <div class="col-sm-3 col-md-3">
        <WidgetCard
        title="Completed Transactions (month)"
        data="120"
        icon="fas fa-file-invoice-dollar"
        />
      </div>
    </div>
    
    
    <div class="row">
      <div class="col-12">
        <LineChart
        title="Completed vs Failed Transactions"
        subtitle="This graph shows a comparision between transactions that were completed and transactions that failed"
        ref="chart"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <LineChart
        title="Cash vs Card Transactions"
        subtitle="This graph shows a comparision between transactions done by cash and transactions completed by card"
        ref="chart"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <DataTable
        title="Delivery Transactions"
        subtitle="This table shows all the recent deliveries"
        :items="tableItems"
        :headers="headers"
        />
      </div>
    </div>
  </Layout>
</template>

<script>
import Layout from "../../layouts/horizontal.vue";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import LineChart from "@/components/charts/line-chart.vue"
import WidgetCard from "@/components/widgets/card";
import DataTable from "@/components/tables/data-table.vue"

/**
 * Starter component
 */
export default {
  page: {
    title: "Starter Page",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout, PageHeader, LineChart, WidgetCard, DataTable },
  data() {
    return {
      title: "Dashboard",
      items: [
        {
          text: "dashboard",
          active: true
        }
      ],
      click: false,

      headers: [
        {
          label: "Id",
          key: "id"
        },
        {
          label: "First Name",
          key: "first_name"
        },
        {
          label: "Last Name",
          key: "last"
        },
        {
          label: "Actions",
          key: "action"
        }
      ],

      tableItems: [
        {
          id: 123,
          first_name: "Sheldon",
          last_name: "Wilton"
        }
      ]

    };
  },

};
</script>