<template>
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">{{ title }}</h5>
      <p class="font-weight-light text-muted mb-4">{{ subtitle }}</p>
      <!-- Column Charts -->
      <apexchart
        ref="chart"
        class="apex-charts"
        height="380"
        type="bar"
        dir="ltr"
        :series="series"
        :options="chartOptions"
      ></apexchart>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    subtitle: String,
  },

  data() {
    return {
      series: [],

      chartOptions: {
        stroke: {
          width: [3, 3],
          curve: "straight",
        },
        chart: {
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            dataLabels: {
              position: "top", // top, center, bottom
            },
          },
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return val;
          },
          offsetY: -22,
          style: {
            fontSize: "12px",
            colors: ["#304758"],
          },
        },
        colors: ["#556ee6"],
        grid: {
          row: {
            colors: ["transparent", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.2,
          },
          borderColor: "#f1f1f1",
        },
        xaxis: {
          categories: [],
          tooltip: {
            enabled: true,
            offsetY: -35,
          },
        },
        fill: {
          gradient: {
            shade: "light",
            type: "horizontal",
            shadeIntensity: 0.25,
            gradientToColors: undefined,
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [50, 0, 100, 100],
          },
        },
        yaxis: {
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          labels: {
            show: false,
            formatter: function (val) {
              return val ;
            },
          },
        },
        // title: {
        //   text: "Monthly Inflation in Argentina, 2002",
        //   floating: true,
        //   offsetY: 330,
        //   align: "center",
        //   style: {
        //     color: "#444",
        //     fontWeight: "500",
        //   },
        // },
      },
    };
  },

  methods: {
    renderChart(labelList, series) {
      this.$refs.chart.setOption({
        xaxis: {
          categories: labelList,
          title: {
            text: "Months",
          },
        },
        series,
      });
    },
  },
};
</script>

<style scoped></style>
