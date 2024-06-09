import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import qs from 'qs';

const connectionInstance = axios.create({
  timeout: 10_000,
  baseURL: '',
  paramsSerializer: params => {
    return qs.stringify(params);
  },
  // paramsSerializer(params: { [x: string]: any }) {
  //   const searchParams = new URLSearchParams();
  //   for (const key of Object.keys(params)) {
  //     const param = params[key];
  //     if (param !== undefined) {
  //       if (Array.isArray(param)) {
  //         let ids = '';
  //         param.forEach((p, i) => {
  //           if (i + 1 === param.length) {
  //             ids += `${p}`;
  //           } else {
  //             ids += `${p},`;
  //           }
  //         });
  //         searchParams.append(key, ids);
  //       } else {
  //         searchParams.append(key, param);
  //       }
  //     }
  //   }
  // return searchParams.toString();
  // },
});

connectionInstance.interceptors.request.use(
  async (requestConfig: InternalAxiosRequestConfig<any>) => {
    // console.info(
    //   `Request: ${requestConfig.method} - ${requestConfig.url}`,
    //   requestConfig,
    // );
    // const httpMetric = perf().newHttpMetric(
    //   requestConfig.url,
    //   requestConfig.method,
    // );
    // requestConfig.metadata = { httpMetric };

    // // add any extra metric attributes, if required
    // // httpMetric.putAttribute('userId', '12345678');

    // await httpMetric.start();

    return requestConfig;
  },
  (error: any) => {
    return Promise.reject(error);
  },
);

connectionInstance.interceptors.response.use(
  async (response: AxiosResponse) => {
    // console.info(
    //   `Response: ${response.config.method} - ${response.config.url}`,
    //   response,
    // );

    // Request was successful, e.g. HTTP code 200

    // const { httpMetric } = response.config.metadata;

    // // add any extra metric attributes if needed
    // // httpMetric.putAttribute('userId', '12345678');

    // httpMetric.setHttpResponseCode(response.status);
    // httpMetric.setResponseContentType(response.headers['content-type']);
    // await httpMetric.stop();

    return response;
  },
  async error => {
    // Request failed, e.g. HTTP code 500

    // const { httpMetric } = error.config.metadata;

    // // add any extra metric attributes if needed
    // // httpMetric.putAttribute('userId', '12345678');

    // httpMetric.setHttpResponseCode(error.response.status);
    // httpMetric.setResponseContentType(error.response.headers['content-type']);
    // await httpMetric.stop();

    const originalRequest: InternalAxiosRequestConfig<any> & {
      _retry: boolean;
    } = error.config;

    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (
        error.response.status === 401 &&
        error.config.url === 'auth/refresh-token'
      ) {
        // await auth().signOut();
        return Promise.reject(error);
      }

      // const refreshToken = store.getState().auth.refreshToken;
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      console.log('refreshToken', refreshToken);
      if (!refreshToken) {
        // await auth().signOut();
        return Promise.reject(error);
      }
      return connectionInstance(originalRequest);
    }
    return Promise.reject(error);
  },
);

export const setTokenHeader = (token: string) => {
  connectionInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export default connectionInstance;
