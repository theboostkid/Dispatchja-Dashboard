const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default {
  methods: {
    formatAsMoney(value) {
      return formatter.format(value);
    }
  }
}