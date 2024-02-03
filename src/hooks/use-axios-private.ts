import { useEffect } from 'react';
import axios from '@/lib/axios';
import useRefreshtoken from '@/hooks/use-refresh-token';
import { useAuthStore } from '@/store/auth-store';
import { usePathname } from 'next/navigation';

const useAxiosPrivate = () => {
  const authStore = useAuthStore();
  const pathname = usePathname();
  const { refresh } = useRefreshtoken();

  useEffect(() => {
    const requestIntercept = axios.interceptors.request.use(
      (config) => {
        if (!config.headers.Authorization) {
          // eslint-disable-next-line no-console
          console.log('Previous token', authStore.token);
          config.headers.Authorization = `Bearer ${authStore.token}`;
        }
        return config;
      }, (error) => {
        Promise.reject(error);
      }
    )

    const responseIntercept = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest.sent && !pathname.includes('/auth')) {
          originalRequest.sent = true;
          const { access_token } = await refresh();
          // eslint-disable-next-line no-console
          console.log('Refresh token', access_token)
          authStore.setToken(access_token);
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return axios(originalRequest)
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestIntercept);
      axios.interceptors.response.eject(responseIntercept);
    };
  }, [authStore, refresh, pathname]);

  return axios;
};

export default useAxiosPrivate;