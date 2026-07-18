import api from "./axiosConfig";

export const getAllExams = () => api.get("/api/exams");
export const getExamsByCourse = (courseId) =>
  api.get(`/api/exams/course/${courseId}`);
export const createExam = (exam) => api.post("/api/exams", exam);
export const deleteExam = (id) => api.delete(`/api/exams/${id}`);
