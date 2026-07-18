import api from "./axiosConfig";

export const getAllCourses = () => api.get("/api/courses");
export const getCourseById = (id) => api.get(`/api/courses/${id}`);
export const createCourse = (course) => api.post("/api/courses", course);
export const updateCourse = (id, course) =>
  api.put(`/api/courses/${id}`, course);
export const deleteCourse = (id) => api.delete(`/api/courses/${id}`);
