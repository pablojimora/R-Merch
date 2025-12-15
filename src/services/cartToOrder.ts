import axios from "axios";

export const createOrder = async (orderPayload: any) => {
  return axios.post("/api/orders", orderPayload);
};
