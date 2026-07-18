import { useState, useEffect } from "react";
import { Container, Table, Button, Alert, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { getAllExams } from "../api/examService";
import { getEnrollmentsByCourse } from "../api/enrollmentService";
import { getGradesByExam, recordGrade } from "../api/gradeService";

export default function Grades() {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [roster, setRoster] = useState([]);
  const [gradesMap, setGradesMap] = useState({});
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState("");

  const loadData = async () => {
    setError("");
    try {
      const examsRes = await getAllExams();
      const currentExam = examsRes.data.find((e) => e.id === parseInt(examId));
      setExam(currentExam);

      if (!currentExam) return;

      const [enrollmentsRes, gradesRes] = await Promise.all([
        getEnrollmentsByCourse(currentExam.course.id),
        getGradesByExam(examId),
      ]);

      setRoster(enrollmentsRes.data.map((e) => e.student));

      const map = {};
      gradesRes.data.forEach((g) => {
        map[g.student.id] = g.marksObtained;
      });
      setGradesMap(map);
    } catch (err) {
      setError("Failed to load grade data");
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId]);

  const handleInputChange = (studentId, value) => {
    setInputs({ ...inputs, [studentId]: value });
  };

  const handleSave = async (studentId) => {
    const marks = parseFloat(inputs[studentId]);
    if (isNaN(marks)) return;
    setError("");
    try {
      await recordGrade(studentId, examId, marks);
      setGradesMap({ ...gradesMap, [studentId]: marks });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to record grade");
    }
  };

  if (!exam) {
    return (
      <Container className="mt-5">
        {error && <Alert variant="danger">{error}</Alert>}
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h2 className="mb-1">{exam.examName}</h2>
      <p className="text-muted mb-4">
        {exam.course.courseName} — Max Marks: {exam.maxMarks}
      </p>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Student</th>
            <th>Current Grade</th>
            <th>Enter Marks</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {roster.map((student) => (
            <tr key={student.id}>
              <td>
                {student.firstName} {student.lastName}
              </td>
              <td>{gradesMap[student.id] ?? "Not graded"}</td>
              <td>
                <Form.Control
                  type="number"
                  style={{ width: "120px" }}
                  placeholder="Marks"
                  value={inputs[student.id] || ""}
                  onChange={(e) =>
                    handleInputChange(student.id, e.target.value)
                  }
                />
              </td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleSave(student.id)}
                >
                  Save
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
