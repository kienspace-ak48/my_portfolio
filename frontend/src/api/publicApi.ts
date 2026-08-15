import axios from "axios";

export const BASE_API = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";

/** Public endpoints — never attaches Authorization or refresh logic. */
const publicApi = axios.create({
  baseURL: BASE_API,
  timeout: 10000,
});

export default publicApi;
