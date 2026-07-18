import { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Alert,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import {
  getAllEnrollments,
  createEnrollment,
  deleteEnrollment,
} from "../api/enrollmentService";
import { getAllStudents } from "../api/studentService";
import { getAllCourses } from "../api/courseService";

export default function Enrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const [enrollmentsRes, studentsRes, coursesRes] = await Promise.all([
        getAllEnrollments(),
        getAllStudents(),
        getAllCourses(),
      ]);
      setEnrollments(enrollmentsRes.data);
      setStudents(studentsRes.data);
      setCourses(coursesRes.data);
    } catch (err) {
      setError("Failed to load data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEnroll = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createEnrollment(parseInt(studentId), parseInt(courseId));
      setStudentId("");
      setCourseId("");
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to enroll student");
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm("Remove this enrollment?")) return;
    try {
      await deleteEnrollment(id);
      loadData();
    } catch (err) {
      setError("Failed to remove enrollment");
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Enrollments</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleEnroll} className="mb-4">
        <Row className="align-items-end">
          <Col md={4}>
            <Form.Label>Student</Form.Label>
            <Form.Select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            >
              <option value="">Select a student</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.firstName} {s.lastName}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={4}>
            <Form.Label>Course</Form.Label>
            <Form.Select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              required
            >
              <option value="">Select a course</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.courseName} ({c.courseCode})
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={4}>
            <Button type="submit" variant="primary">
              Enroll
            </Button>
          </Col>
        </Row>
      </Form>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Student</th>
            <th>Course</th>
            <th>Enrolled On</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {enrollments.map((enrollment) => (
            <tr key={enrollment.id}>
              <td>
                {enrollment.student.firstName} {enrollment.student.lastName}
              </td>
              <td>
                {enrollment.course.courseName} ({enrollment.course.courseCode})
              </td>
              <td>{enrollment.enrolledOn}</td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemove(enrollment.id)}
                >
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
