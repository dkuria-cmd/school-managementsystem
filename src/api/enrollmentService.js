import api from "./axiosConfig";

export const getAllEnrollments = () => api.get("/api/enrollments");
export const getEnrollmentsByCourse = (courseId) =>
  api.get(`/api/enrollments/course/${courseId}`);
export const getEnrollmentsByStudent = (studentId) =>
  api.get(`/api/enrollments/student/${studentId}`);
export const createEnrollment = (studentId, courseId) =>
  api.post("/api/enrollments", { studentId, courseId });
export const deleteEnrollment = (id) => api.delete(`/api/enrollments/${id}`);
