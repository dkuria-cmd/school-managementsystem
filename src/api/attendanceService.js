import api from "./axiosConfig";

export const getAllAttendance = () => api.get("/api/attendance");

export const getAttendanceByCourseAndDate = (courseId, date) =>
  api.get(`/api/attendance/course/${courseId}`, { params: { date } });

export const getAttendanceByStudent = (studentId) =>
  api.get(`/api/attendance/student/${studentId}`);

export const markAttendance = (studentId, courseId, date, status) =>
  api.post("/api/attendance", { studentId, courseId, date, status });
