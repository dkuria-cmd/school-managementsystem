import { useState, useEffect } from "react";
import { Container, Table, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getAllStudents, deleteStudent } from "../api/studentService";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");

  const loadStudents = async () => {
    try {
      const response = await getAllStudents();
      setStudents(response.data);
    } catch (err) {
      setError("Failed to load students");
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await deleteStudent(id);
      loadStudents();
    } catch (err) {
      setError("Failed to delete student");
    }
  };

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Students</h2>
        <Link to="/students/add">
          <Button variant="primary">Add Student</Button>
        </Link>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Admission No.</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Enrollment Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.admissionNumber}</td>
              <td>{student.firstName}</td>
              <td>{student.lastName}</td>
              <td>{student.email}</td>
              <td>{student.enrollmentDate}</td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(student.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
