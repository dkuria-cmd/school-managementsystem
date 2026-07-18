import api from "./axiosConfig";

export const getAllStudents = () => api.get("/api/students");
export const getStudentById = (id) => api.get(`/api/students/${id}`);
export const createStudent = (student) => api.post("/api/students", student);
export const updateStudent = (id, student) =>
  api.put(`/api/students/${id}`, student);
export const deleteStudent = (id) => api.delete(`/api/students/${id}`);
