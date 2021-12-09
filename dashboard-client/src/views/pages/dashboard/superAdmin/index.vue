<script>
import Layout from "../../../layouts/horizontal";
import appConfig from "../../../../../app.config";

import WidgetChart from "@/components/widgets/Widget-chart";
import PageHeader from "@/components/Page-header";
import RevenueReport from "@/components/widgets/Revenue-report";
import ProductsSales from "@/components/widgets/Products-sales";
import MarketingReports from "@/components/widgets/Marketing-reports";
import Portlet from "@/components/widgets/Portlet";
import RevenueHistory from "@/components/widgets/Revenue-history";
import Projections from "@/components/widgets/Projections";

/**
 * Sales-Dashboard component
 */
export default {
  page: {
    title: "Super-Admin-Dashboard",
    meta: [{ name: "description", content: appConfig.description }],
  },
  components: {
    Layout,
    WidgetChart,
    PageHeader,
    RevenueReport,
    ProductsSales,
    MarketingReports,
    Portlet,
    RevenueHistory,
    Projections,
  },
  data() {
    return {
      title: "Welcome Super Admin!",
      items: [
        {
          text: "Dispatch JA",
        },
        {
          text: "Dashboards",
        },
        {
          text: "Super Admin",
          active: true,
        },
      ],
      tableTitle: "This Month's Transaction Breakdown",
      productData: [
        {
          date: "Decemeber 8, 2021",
          order_id: "373163449",
          restaurantName: "Just Salalds",
          customerName: "Shara-Kay Kinlocke",
          paymentMethod: "CARD",
          deliveryFee: "$600.00",
          subtotal:"5,300.00",
          total:"$5,900.00",
          deliveredBy:"Anthony Lecky",
          status: "Completed"
          
        },
        
      ],
      widgetData: [
        {
          number: "26",
          text: "Active Restaurants",
          chartColor: "#1abc9c",
        },
        {
          number: "$488,574",
          text: "Total Money Collected this Month",
          chartColor: "#3bafda",
        },
        {
          number: "$123,958.25",
          text: "Outstanding Payments",
          chartColor: "#f672a7",
        },
        {
          number: "$18,829.25",
          text: "Daily Revenue",
          chartColor: "#6c757d",
        },
      ],
    };
  },
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div
        v-for="widget in widgetData"
        :key="widget.text"
        class="col-xl-3 col-md-6"
      >
        <WidgetChart
          :number="widget.number"
          :text="widget.text"
          :chart-color="widget.chartColor"
        />
      </div>
      <!-- end col -->
    </div>
    <!-- end row -->
    <div class="row">
      <div class="col-xl-4 col-lg-6">
        <RevenueReport />
      </div>
      <!-- end col -->
      <div class="col-xl-4 col-lg-6">
        <ProductsSales />
      </div>
      <!-- end col -->
       <div class="col-xl-4">
        <Projections />
      </div>
      <!-- end col -->
    </div>
    <!-- end row -->
    <div class="row">
      <!-- Table -->
      <div class="col-xl-12">
        <Portlet :headertitle="tableTitle">
          <div class="card-body pt-0">
            <div class="table-responsive mb-0">
              <table class="table table-hover table-centered mb-0">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Order ID</th>
                    <th>Restaurant Name</th>
                    <th>Customer Name</th>
                    <th>Payment Method</th>
                    <th>Delivery Fee</th>
                    <th>Subtotal</th>
                    <th>Total</th>
                    <th>Delivered By:</th>
                    <th>Status</th>
                                      </tr>
                </thead>
                <tbody>
                  <tr v-for="sellingData in productData" :key="sellingData.id">
                    <td>{{ sellingData.date }}</td>
                    <td>{{ sellingData.order_id }}</td>
                    <td>{{ sellingData.restaurantName }}</td>
                    <td>{{ sellingData.customerName }}</td>
                    <td><span class="badge badge-soft-danger p-1">{{ sellingData.paymentMethod }}</span></td>
                    <td>{{ sellingData.deliveryFee }}</td>
                    <td>{{ sellingData.subtotal }}</td>
                    <td>{{ sellingData.total }}</td>
                    <td>{{ sellingData.deliveredBy}}</td>          
                    <td><span class="badge badge-soft-info p-1">{{ sellingData.status }}</span></td>
                    <td>{{ sellingData.sales }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Portlet>
      </div>
    </div>
    <!-- end row -->
    <!-- <div class="row">
      <div class="col-xl-8">
        <RevenueHistory />
      </div> -->
      <!-- end col -->
    
      <!-- end col -->
    <!-- </div> -->
    <!-- end row -->
  </Layout>
</template>
