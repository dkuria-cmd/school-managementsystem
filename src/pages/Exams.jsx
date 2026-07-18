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
import { Link } from "react-router-dom";
import { getAllCourses } from "../api/courseService";
import { getExamsByCourse, createExam, deleteExam } from "../api/examService";

export default function Exams() {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [exams, setExams] = useState([]);
  const [examName, setExamName] = useState("");
  const [examDate, setExamDate] = useState("");
  const [maxMarks, setMaxMarks] = useState("");
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

  const loadExams = async () => {
    if (!courseId) return;
    try {
      const response = await getExamsByCourse(courseId);
      setExams(response.data);
    } catch (err) {
      setError("Failed to load exams");
    }
  };

  useEffect(() => {
    loadExams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const handleAddExam = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createExam({
        examName,
        examDate,
        maxMarks: parseFloat(maxMarks),
        course: { id: parseInt(courseId) },
      });
      setExamName("");
      setExamDate("");
      setMaxMarks("");
      loadExams();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create exam");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this exam?")) return;
    try {
      await deleteExam(id);
      loadExams();
    } catch (err) {
      setError("Failed to delete exam");
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Exams</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form.Group className="mb-4">
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
      </Form.Group>

      {courseId && (
        <>
          <Form onSubmit={handleAddExam} className="mb-4">
            <Row className="align-items-end">
              <Col md={4}>
                <Form.Label>Exam Name</Form.Label>
                <Form.Control
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  placeholder="e.g. Midterm"
                  required
                />
              </Col>
              <Col md={3}>
                <Form.Label>Exam Date</Form.Label>
                <Form.Control
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  required
                />
              </Col>
              <Col md={2}>
                <Form.Label>Max Marks</Form.Label>
                <Form.Control
                  type="number"
                  value={maxMarks}
                  onChange={(e) => setMaxMarks(e.target.value)}
                  required
                />
              </Col>
              <Col md={3}>
                <Button type="submit" variant="primary">
                  Add Exam
                </Button>
              </Col>
            </Row>
          </Form>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Exam Name</th>
                <th>Date</th>
                <th>Max Marks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam) => (
                <tr key={exam.id}>
                  <td>{exam.examName}</td>
                  <td>{exam.examDate}</td>
                  <td>{exam.maxMarks}</td>
                  <td>
                    <Link to={`/grades/${exam.id}`} className="me-2">
                      <Button variant="primary" size="sm">
                        Record Grades
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(exam.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </Container>
  );
}
