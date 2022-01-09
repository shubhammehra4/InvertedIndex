import axios from "axios";

export const server = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
});
