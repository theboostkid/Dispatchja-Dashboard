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
const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
});

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
          zoom: {
            enabled: false,
          },
          toolbar: {
            show: false,
          },
        },
        dataLabels: {
          enabled: false,
          formatter: function (val) { console.log('value: ', val); return formatter.format(val) }
        },
        stroke: {
          width: [4, 4, 4],
          curve: "straight",
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
          labels: {
            formatter: (value) => formatter.format(value)
          }
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
    renderChart(categories, categoryText, series) {
      this.$refs.chart.updateOptions({
        xaxis: {
          categories: categories,
          title: {
            text: categoryText,
          },
        },

        colors: series.color
      });

      if(Array.isArray(series) && series.length > 0)
        this.$refs.chart.updateSeries(series, true);
    },
  },
};
</script>

<style scoped></style>
