import countriesAndSubDivisions from "../utils/json/countries_and_sub_divisions.json";

export default {
  data() {
    return {
      countries: [],
      provinces: [],
    }
  },

  methods: {
    loadCountries() {
      Object.keys(countriesAndSubDivisions).forEach((key) => {
          this.countries.push(countriesAndSubDivisions[key])
      });
      return;
    },

    getProvinces(selectedCountry){
      const country = this.countries.filter(country => country.name == selectedCountry);
      if(country.length > 0) {
        const provinces = country[0].divisions;
        this.provinces = Object.values(provinces);
        return this.provinces;
      } else {
        this.provinces = [];
        return this.provinces;
      }
    }
  }
}