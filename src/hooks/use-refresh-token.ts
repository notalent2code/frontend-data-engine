import axios from '@/lib/axios';

const useRefreshtoken = () => {
  const refresh = async () => {
    const { data } = await axios.get('/auth/refresh-token');
    return {
      access_token: data.access_token
    }
  }

  return { refresh };
}

export default useRefreshtoken;