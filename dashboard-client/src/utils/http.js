import axios from 'axios';

const defaultConfig = {
  baseURL: process.env.VUE_APP_ROOT_API,
  withCredentials: true
};

class Http {
  axiosconfig;
  axiosInstance;

  constructor(config = defaultConfig) {
    this.axiosconfig = config;


    this.axiosInstance = axios.create(this.axiosconfig);
    //Response interceptor
    this.axiosInstance.interceptors.response.use(
      function(response) {
        const { status, data } = response;
        return {
          status,
          data: data.data || data
        };
      },
      function(err) {
        const { statusCode, message, error } = err.response.data;
        return {
          status: statusCode,
          message,
          error
        }
      }
    );
  }

  httpClient() {
    return this.axiosInstance;
  }
}

export { Http };
