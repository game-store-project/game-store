import { getAuthToken, getCartToken } from '@/actions/headers';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL_API?.concat('/api/v1'),
});

api.interceptors.request.use(async (config) => {
  const auth_token = await getAuthToken();
  const cart_token = await getCartToken();

  if (auth_token) {
    config.headers.Authorization = auth_token;
  }

  if (cart_token) {
    config.headers.cart_items = cart_token;
  }

  return config;
});

export { api };
