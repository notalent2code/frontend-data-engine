import { useEffect } from 'react';
import axios from '@/lib/axios';
import useRefreshtoken from '@/hooks/use-refresh-token';

const useAxiosPrivate = () => {
  const { refresh } = useRefreshtoken();

  useEffect(() => {
    // const requestIntercept = axios.interceptors.request.use(
    //   (config) => {
    //     if (!config.headers.Authorization) {
    //       config.headers.Authorization = `Bearer ${localStorage.getItem('access_token')}`;
    //     }
    //     return config;
    //   }, (error) => {
    //     Promise.reject(error);
    //   }
    // )

    const responseIntercept = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest.sent) {
          originalRequest.sent = true;
          const { access_token } = await refresh();
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return axios(originalRequest)
        }
        return Promise.reject(error);
      }
    );

    return () => {
      // axios.interceptors.request.eject(requestIntercept);
      axios.interceptors.response.eject(responseIntercept);
    };
  }, [refresh]);

  return axios;
};

export default useAxiosPrivate;