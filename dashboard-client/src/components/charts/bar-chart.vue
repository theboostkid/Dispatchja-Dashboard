<template>
  <div class="card" :class="themeClass">
    <div class="card-body">
      <h5 class="card-title" :class="themeClass">{{ title }}</h5>
      <p class="font-weight-light text-muted mb-4">{{ subtitle }}</p>

      <BarChartGenerator
        :chart-data="chartData"
        :height="height"
        :chart-options="chartOptions"
        css-classes="text-white"
      />
    </div>
  </div>
</template>

<script>
import { Bar as BarChartGenerator } from "vue-chartjs/legacy";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { layoutComputed } from '../../state/helpers'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default {
  name: "BarChart",

  components: { BarChartGenerator },

  props: {
    title: {
      type: String,
      default: "",
    },

    subtitle: {
      type: String,
      default: "",
    },

    chartData: {
      type: Object,
      default: () => {
        return {
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          datasets: [{ data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }],
          backgroundColor: "#f87979",
        };
      },
    },

    height: {
      type: Number,
      default: 100,
    },

    chartDataFormat: {
      type: String,
      default: "money",
    },
  },

  data() {
    return {
      chartOptions: {
        responsive: true,

        scales: {
          y: {
            ticks: {
              callback: function (val) {
                return formatter.format(Number(val) || 0);
              },
            },
          },
        },

        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                let label = context.dataset.label;
                if (label) {
                  label += ": ";
                }
                if (context.parsed.y !== null) {
                  label += formatter.format(context.parsed.y || 0);
                }
                return label;
              },
            },
          },
        },
      },
    };
  },

  beforeMount() {
    if (this.chartDataFormat.toLowerCase() == "money") {
      this.chartOptions = {
        responsive: true,

        scales: {
          y: {
            ticks: {
              callback: function (val) {
                return formatter.format(Number(val) || 0);
              },
            },
          },
        },

        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                let label = context.dataset.label;
                if (label) {
                  label += ": ";
                }
                if (context.parsed.y !== null) {
                  label += formatter.format(context.parsed.y || 0);
                }
                return label;
              },
            },
          },
        },
      };
    } else if (this.chartDataFormat.toLowerCase() == "number") {
      this.chartOptions = {
        responsive: true,
      };
    }
  },

  computed: {
    ...layoutComputed
  },
};
</script>

<style lang="scss" scoped></style>
