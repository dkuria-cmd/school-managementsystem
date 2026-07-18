import api from "./axiosConfig";

export const getAllTeachers = () => api.get("/api/teachers");
export const getTeacherById = (id) => api.get(`/api/teachers/${id}`);
export const createTeacher = (teacher) => api.post("/api/teachers", teacher);
export const updateTeacher = (id, teacher) =>
  api.put(`/api/teachers/${id}`, teacher);
export const deleteTeacher = (id) => api.delete(`/api/teachers/${id}`);
