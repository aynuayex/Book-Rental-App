import axios from 'axios';
import { API_BASE_URL } from '@/constants/APIConstants';

export default axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

export const axiosPrivate = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

