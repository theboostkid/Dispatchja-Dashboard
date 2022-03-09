<template>
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">{{ title }}</h5>
      <p class="font-weight-light text-muted mb-4">{{ subtitle }}</p>
      <apexchart
        ref="chart"
        class="apex-charts"
        height="350"
        type="line"
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
    subtitle: String
  },
  
  data() {
    return {
      series: [],

      chartOptions: {
        chart: {
          stacked: false,
          toolbar: {
            show: false,
          },
        },
        stroke: {
          width: [0, 2, 4],
          curve: "smooth",
        },
        plotOptions: {
          bar: {
            columnWidth: "25%",
          },
        },
        colors: ["#f46a6a", "#556ee6", "#34c38f"],
        fill: {
          opacity: [0.85, 0.25, 1],
          gradient: {
            inverseColors: false,
            shade: "light",
            type: "vertical",
            opacityFrom: 0.85,
            opacityTo: 0.55,
            stops: [0, 100, 100, 100],
          },
        },
        labels: [],
        markers: {
          size: 0,
        },
        xaxis: {
          categories: [],
          title: {
            text: "Months",
          },
        },
        yaxis: {
          title: {
            text: "Money",
          },
        },
        tooltip: {
          shared: true,
          intersect: false,
          y: {
            formatter: function (y) {
              if (typeof y !== "undefined") {
                return y.toFixed(0) + " points";
              }
              return y;
            },
          },
        },
        grid: {
          borderColor: "#f1f1f1",
        },
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
