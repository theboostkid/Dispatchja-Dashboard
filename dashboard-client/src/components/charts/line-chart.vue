<template>
  <div class="card" :class="themeClass">
    <div class="card-body">
      <h5 class="card-title" :class="themeClass">{{ title }}</h5>
      <p class="font-weight-light text-muted mb-4">{{ subtitle }}</p>
      <div>
        <!-- Dashed Line Chart -->
        <apexchart
          ref="chart"
          class="apex-charts"
          height="380"
          type="line"
          dir="ltr"
          :series="series"
          :options="chartOptions"
        ></apexchart>
      </div>
    </div>
  </div>
</template>

<script>
import { layoutComputed } from '../../state/helpers'

const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
});

export default {
  computed: {
    ...layoutComputed
  },
  props: {
    title: String,
    subtitle: String
  },

  data() {
    return {
      chartOptions: {
        chart: {
          height: 400,
          type: "line",
          zoom: {
            enabled: false,
          },
          toolbar: {
            show: false,
          },
        },
        colors: ["#556ee6", "#34c38f"],
        dataLabels: {
          enabled: false,
          formatter: function (val) { console.log('value: ', val); return formatter.format(val) }
        },
        stroke: {
          width: [4, 4, 4, 4],
          curve: "straight",
        },
        grid: {
          row: {
            colors: ["transparent", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.2,
          },
          borderColor: "#f1f1f1",
        },
        markers: {
          style: "inverted",
          size: 6,
        },
        xaxis: {
          categories: [],
        },
        yaxis: {
          title: {
            text: "Money",
          },
          labels: {
            formatter: (value) => formatter.format(value)
          }
        },
        legend: {
          position: "top",
          horizontalAlign: "right",
          floating: true,
          offsetY: -25,
          offsetX: -5,
        },
        
        // responsive: [
        //   {
        //     breakpoint: 600,
        //     options: {
        //       chart: {
        //         toolbar: {
        //           show: false,
        //         },
        //       },
        //       legend: {
        //         show: false,
        //       },
        //     },
        //   },
        // ],
      },
      series: [
        {
          name: "",
          data: []
        },
        {
          name: "",
          data: []
        }
      ]
    };
  },

  methods: {
    renderChart(categories, categoryText, series) {
      this.$refs.chart.updateOptions({
        xaxis: {
          categories: categories,
          title: {
            text: categoryText
          }
        }
      })
      
      if(Array.isArray(series) && series.length > 0)
        this.$refs.chart.updateSeries(series, true);
    },
  },
};
</script>

<style scoped></style>
