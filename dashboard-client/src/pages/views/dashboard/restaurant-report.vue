<template>
  <Layout>
    <PageHeader :title="title" :items="items" />

    <div class="row">
      <div class="col-xl-3">
        <WidgetCard
        title="Total Delivery (month)"
        data="130"
        icon="fas fa-shipping-fast"
        />
      </div>

      <div class="col-xl-3">
        <WidgetCard
        title="Total Deliver Earnings (month)"
        data="$300"
        icon="fas fa-money-bill-alt"
        />
      </div>

      <div class="col-xl-3">
        <WidgetCard
        title="Total Credit Card Fees (month)"
        data="$500"
        icon="fas fa-money-check-alt"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-lg-6">
        <LineGraph
        title="Completed vs Failed Transactions"
        subtitle="This graph compares transactions that failed and transactions that were successfull"
        ref="chart"
        />
      </div>
      
      <div class="col-lg-6">
        <BarChart
        title="Deliveries Count"
        subtitle="This graph shows the total delievers that occurred over the period"
        ref="lineGraph"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <MixedGraph
        title="Total Cash, Card and Sales Graph"
        subtitle="This graph shows a comparison between card and cash sales and the total sales made"
        ref="mixedGraph"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <DataTable
        ref="table"
        :headers="headers"
        :items="tableItems"
        />
      </div>
    </div>
  </Layout>
</template>

<script>
import Layout from "../../layouts/horizontal.vue";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import WidgetCard from "@/components/widgets/card"
import LineGraph from "@/components/charts/line-chart"
import MixedGraph from "@/components/charts/mixed-chart.vue"
import BarChart from '../../../components/charts/bar-chart.vue';
import DataTable from '../../../components/tables/data-table.vue';

/**
 * Starter component
 */
export default {
  page: {
    title: "Starter Page",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout, PageHeader, WidgetCard, LineGraph, MixedGraph, BarChart, DataTable},
  data() {
    return {
      title: "Restaurant Reports",
      items: [
        {
          text: "reports",
        },
        {
          text: "restaurant reports",
          active: true
        }
      ],

      headers: [
        {
          label: "Date",
          key: "date"
        },
        {
          label: "Order ID",
          key: "order_id"
        },
        {
          label: "Restaurant Name",
          key: "restaurant_name"
        },
        {
          label: "Customer Name",
          key: "customer_name"
        },
        {
          label: "Payment Method",
          key: "payment_method"
        },
        {
          label: "Delivery Fee",
          key: "fee"
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
          label: "Delivered by",
          kwy: "delivered_by"
        },
        {
          label: "Status",
          key: "status"
        },
      ],
      tableItems: []
    };
  }
};
</script>