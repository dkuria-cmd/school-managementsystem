import api from "./axiosConfig";

export const getAllFees = () => api.get("/api/fees");
export const getFeesByStudent = (studentId) =>
  api.get(`/api/fees/student/${studentId}`);
export const createFee = (fee) => api.post("/api/fees", fee);
export const payFee = (id, amount) =>
  api.post(`/api/fees/${id}/pay`, { amount });
export const deleteFee = (id) => api.delete(`/api/fees/${id}`);
