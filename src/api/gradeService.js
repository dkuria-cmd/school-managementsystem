import api from "./axiosConfig";

export const getGradesByExam = (examId) =>
  api.get(`/api/grades/exam/${examId}`);
export const getGradesByStudent = (studentId) =>
  api.get(`/api/grades/student/${studentId}`);
export const recordGrade = (studentId, examId, marksObtained) =>
  api.post("/api/grades", { studentId, examId, marksObtained });
