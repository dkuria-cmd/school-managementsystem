import { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Alert,
  Form,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import { getAllCourses } from "../api/courseService";
import { getEnrollmentsByCourse } from "../api/enrollmentService";
import {
  getAttendanceByCourseAndDate,
  markAttendance,
} from "../api/attendanceService";

export default function Attendance() {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [date, setDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [roster, setRoster] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await getAllCourses();
        setCourses(response.data);
      } catch (err) {
        setError("Failed to load courses");
      }
    };
    loadCourses();
  }, []);

  const loadRosterAndAttendance = async () => {
    if (!courseId || !date) return;
    setError("");
    try {
      const [enrollmentsRes, attendanceRes] = await Promise.all([
        getEnrollmentsByCourse(courseId),
        getAttendanceByCourseAndDate(courseId, date),
      ]);

      setRoster(enrollmentsRes.data.map((e) => e.student));

      const map = {};
      attendanceRes.data.forEach((record) => {
        map[record.student.id] = record.status;
      });
      setAttendanceMap(map);
    } catch (err) {
      setError("Failed to load roster or attendance");
    }
  };

  useEffect(() => {
    loadRosterAndAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, date]);

  const handleMark = async (studentId, status) => {
    try {
      await markAttendance(studentId, courseId, date, status);
      setAttendanceMap({ ...attendanceMap, [studentId]: status });
    } catch (err) {
      setError("Failed to mark attendance");
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Attendance</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-4">
        <Col md={6}>
          <Form.Label>Course</Form.Label>
          <Form.Select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
          >
            <option value="">Select a course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.courseName} ({c.courseCode})
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={6}>
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </Col>
      </Row>

      {courseId && roster.length === 0 && (
        <Alert variant="info">No students enrolled in this course yet.</Alert>
      )}

      {roster.length > 0 && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Student</th>
              <th>Status</th>
              <th>Mark</th>
            </tr>
          </thead>
          <tbody>
            {roster.map((student) => (
              <tr key={student.id}>
                <td>
                  {student.firstName} {student.lastName}
                </td>
                <td>
                  {attendanceMap[student.id] ? (
                    <Badge
                      bg={
                        attendanceMap[student.id] === "PRESENT"
                          ? "success"
                          : "danger"
                      }
                    >
                      {attendanceMap[student.id]}
                    </Badge>
                  ) : (
                    <Badge bg="secondary">Not marked</Badge>
                  )}
                </td>
                <td>
                  <Button
                    variant="success"
                    size="sm"
                    className="me-2"
                    onClick={() => handleMark(student.id, "PRESENT")}
                  >
                    Present
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleMark(student.id, "ABSENT")}
                  >
                    Absent
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
