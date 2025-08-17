// utils/axiosInstance.ts

import axios from 'axios';

const APPSERVER_URL = process.env.NEXT_PUBLIC_API_MAIN_ENDPOINT || 'https://appserver.faithtribe.io';

export const axiosInstance = axios.create({
  baseURL: APPSERVER_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

export const axiosUploadInstance = axios.create({
  baseURL: APPSERVER_URL,
  withCredentials: true
});

// export default axiosInstance;
