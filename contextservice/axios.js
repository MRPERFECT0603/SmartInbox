
import axios from "axios";

export const contextRequest = axios.create({
  baseURL: "http://localhost:30001/api",
  withCredentials: true,
});
