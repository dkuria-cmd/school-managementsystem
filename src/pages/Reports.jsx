import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Table,
  Spinner,
} from "react-bootstrap";
import { getAllStudents } from "../api/studentService";
import {
  getStudentTranscript,
  getStudentEnrollments,
  getStudentGrades,
  getStudentFees,
  getStudentAttendance,
  getAllFeesReport,
} from "../api/reportService";

const downloadCSV = (filename, rows) => {
  const csv = rows.join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};

function Reports() {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [transcriptData, setTranscriptData] = useState(null);
  const [error, setError] = useState("");
  const [loadingTranscript, setLoadingTranscript] = useState(false);
  const [loadingFees, setLoadingFees] = useState(false);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const res = await getAllStudents();
        setStudents(res.data);
      } catch (err) {
        setError("Failed to load students");
      }
    };
    loadStudents();
  }, []);

  const generateStudentTranscript = async () => {
    if (!selectedStudentId) {
      setError("Please select a student first");
      return;
    }

    setLoadingTranscript(true);
    setError("");
    setTranscriptData(null);

    try {
      const [studentRes, enrollmentsRes, gradesRes, feesRes, attendanceRes] =
        await Promise.all([
          getStudentTranscript(selectedStudentId),
          getStudentEnrollments(selectedStudentId),
          getStudentGrades(selectedStudentId),
          getStudentFees(selectedStudentId),
          getStudentAttendance(selectedStudentId),
        ]);

      const student = studentRes.data;
      const enrollments = enrollmentsRes.data || [];
      const grades = gradesRes.data || [];
      const fees = feesRes.data || [];
      const attendance = attendanceRes.data || [];

      setTranscriptData({ student, enrollments, grades, fees, attendance });

      const csvRows = [];
      csvRows.push("Student Transcript Report");
      csvRows.push(`Name,${student.firstName} ${student.lastName}`);
      csvRows.push(`Email,${student.email}`);
      csvRows.push(`Admission Number,${student.admissionNumber}`);
      csvRows.push(`Date of Birth,${student.dateOfBirth}`);
      csvRows.push("");
      csvRows.push("Courses Enrolled");
      csvRows.push("Course Name,Course Code,Enrolled On");
      enrollments.forEach((e) => {
        csvRows.push(
          `${e.course.courseName},${e.course.courseCode},${e.enrolledOn}`,
        );
      });
      csvRows.push("");
      csvRows.push("Grades");
      csvRows.push("Exam Name,Marks Obtained,Max Marks");
      grades.forEach((g) => {
        csvRows.push(
          `${g.exam.examName},${g.marksObtained},${g.exam.maxMarks}`,
        );
      });
      csvRows.push("");
      csvRows.push("Fees");
      csvRows.push("Fee Type,Amount Due,Amount Paid,Status");
      fees.forEach((f) => {
        csvRows.push(`${f.feeType},${f.amountDue},${f.amountPaid},${f.status}`);
      });
      csvRows.push("");
      csvRows.push("Attendance");
      csvRows.push("Course,Date,Status");
      attendance.forEach((a) => {
        csvRows.push(`${a.course.courseName},${a.attendanceDate},${a.status}`);
      });

      downloadCSV(
        `Transcript_${student.firstName}_${student.lastName}.csv`,
        csvRows,
      );
    } catch (err) {
      setError(
        "Failed to generate transcript. Check that the student has records.",
      );
    } finally {
      setLoadingTranscript(false);
    }
  };

  const generateFeesReport = async () => {
    setLoadingFees(true);
    setError("");

    try {
      const res = await getAllFeesReport();
      const fees = res.data;

      const csvRows = [];
      csvRows.push("Fees Report");
      csvRows.push(`Generated,${new Date().toISOString().split("T")[0]}`);
      csvRows.push("");
      csvRows.push(
        "Student Name,Fee Type,Amount Due,Amount Paid,Status,Due Date",
      );
      fees.forEach((f) => {
        csvRows.push(
          `${f.student.firstName} ${f.student.lastName},${f.feeType},${f.amountDue},${f.amountPaid},${f.status},${f.dueDate}`,
        );
      });

      downloadCSV(
        `Fees_Report_${new Date().toISOString().split("T")[0]}.csv`,
        csvRows,
      );
    } catch (err) {
      setError("Failed to generate fees report");
    } finally {
      setLoadingFees(false);
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Reports</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-4">
        <Col md={6}>
          <Card className="p-3">
            <h5>Student Transcript</h5>
            <p className="text-muted">
              Select a student to generate a full transcript covering
              enrollments, grades, fees, and attendance.
            </p>
            <Form.Select
              className="mb-3"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
            >
              <option value="">Select a student</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.firstName} {s.lastName} ({s.admissionNumber})
                </option>
              ))}
            </Form.Select>
            <Button
              variant="primary"
              onClick={generateStudentTranscript}
              disabled={loadingTranscript}
            >
              {loadingTranscript ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Generating...
                </>
              ) : (
                "Generate & Download Transcript"
              )}
            </Button>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="p-3">
            <h5>Fees Report</h5>
            <p className="text-muted">
              Download a CSV of all fee records across every student, including
              amounts due, paid, and status.
            </p>
            <Button
              variant="primary"
              onClick={generateFeesReport}
              disabled={loadingFees}
            >
              {loadingFees ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Generating...
                </>
              ) : (
                "Generate & Download Fees Report"
              )}
            </Button>
          </Card>
        </Col>
      </Row>

      {transcriptData && (
        <Row>
          <Col>
            <Card className="p-3">
              <h5>
                Preview: {transcriptData.student.firstName}{" "}
                {transcriptData.student.lastName}
              </h5>

              <h6 className="mt-3">Courses Enrolled</h6>
              {transcriptData.enrollments.length === 0 ? (
                <p className="text-muted">No enrollments.</p>
              ) : (
                <Table striped bordered size="sm">
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Code</th>
                      <th>Enrolled On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transcriptData.enrollments.map((e) => (
                      <tr key={e.id}>
                        <td>{e.course.courseName}</td>
                        <td>{e.course.courseCode}</td>
                        <td>{e.enrolledOn}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}

              <h6 className="mt-3">Grades</h6>
              {transcriptData.grades.length === 0 ? (
                <p className="text-muted">No grades recorded.</p>
              ) : (
                <Table striped bordered size="sm">
                  <thead>
                    <tr>
                      <th>Exam</th>
                      <th>Marks Obtained</th>
                      <th>Max Marks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transcriptData.grades.map((g) => (
                      <tr key={g.id}>
                        <td>{g.exam.examName}</td>
                        <td>{g.marksObtained}</td>
                        <td>{g.exam.maxMarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}

              <h6 className="mt-3">Fees</h6>
              {transcriptData.fees.length === 0 ? (
                <p className="text-muted">No fee records.</p>
              ) : (
                <Table striped bordered size="sm">
                  <thead>
                    <tr>
                      <th>Fee Type</th>
                      <th>Amount Due</th>
                      <th>Amount Paid</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transcriptData.fees.map((f) => (
                      <tr key={f.id}>
                        <td>{f.feeType}</td>
                        <td>{f.amountDue}</td>
                        <td>{f.amountPaid}</td>
                        <td>{f.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}

              <h6 className="mt-3">Attendance</h6>
              {transcriptData.attendance.length === 0 ? (
                <p className="text-muted">No attendance records.</p>
              ) : (
                <Table striped bordered size="sm">
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transcriptData.attendance.map((a) => (
                      <tr key={a.id}>
                        <td>{a.course.courseName}</td>
                        <td>{a.attendanceDate}</td>
                        <td>{a.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default Reports;
