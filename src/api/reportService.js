import api from "./axiosConfig";

export const getStudentTranscript = (studentId) =>
  api.get(`/api/students/${studentId}`);

export const getStudentEnrollments = (studentId) =>
  api.get(`/api/enrollments/student/${studentId}`);

export const getStudentGrades = (studentId) =>
  api.get(`/api/grades/student/${studentId}`);

export const getStudentFees = (studentId) =>
  api.get(`/api/fees/student/${studentId}`);

export const getStudentAttendance = (studentId) =>
  api.get(`/api/attendance/student/${studentId}`);

export const getAllFeesReport = () => api.get("/api/fees");
