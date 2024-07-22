'use server';

import { api } from '@/lib/api';
import { cookies } from 'next/headers';

const AUTH_TOKEN = 'auth';
const CART_TOKEN = 'cart-items';

export const hasAuthToken = async () => {
  return cookies().has(AUTH_TOKEN);
};

export const getAuthToken = async () => {
  return cookies().get(AUTH_TOKEN)?.value;
};

export const setAuthToken = async (token: string) => {
  cookies().set(AUTH_TOKEN, `Bearer ${token}`, {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 1, // 1h
  });
};

export const deleteAuthToken = async () => {
  if (await hasAuthToken()) {
    cookies().delete(AUTH_TOKEN);
  }

  api.defaults.headers.Authorization = '';
};

export const getCartToken = async () => {
  return cookies().get(CART_TOKEN)?.value;
};

export const setCartToken = async (token: string) => {
  cookies().set(CART_TOKEN, token, {
    httpOnly: true,
    secure: true,
  });
};

export const deleteCartItems = async () => {
  if (await getCartToken()) {
    cookies().delete(CART_TOKEN);
  }

  api.defaults.headers.cart_items = '';
};
