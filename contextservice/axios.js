
import axios from "axios";

export const contextRequest = axios.create({
  baseURL: "http://localhost:8101/api",
  withCredentials: true,
});
