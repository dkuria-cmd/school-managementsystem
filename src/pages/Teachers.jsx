import { useState, useEffect } from "react";
import { Container, Table, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getAllTeachers, deleteTeacher } from "../api/teacherService";

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState("");

  const loadTeachers = async () => {
    try {
      const response = await getAllTeachers();
      setTeachers(response.data);
    } catch (err) {
      setError("Failed to load teachers");
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this teacher?")) return;
    try {
      await deleteTeacher(id);
      loadTeachers();
    } catch (err) {
      setError("Failed to delete teacher");
    }
  };

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Teachers</h2>
        <Link to="/teachers/add">
          <Button variant="primary">Add Teacher</Button>
        </Link>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Staff No.</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Subject</th>
            <th>Date Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher) => (
            <tr key={teacher.id}>
              <td>{teacher.staffNumber}</td>
              <td>{teacher.firstName}</td>
              <td>{teacher.lastName}</td>
              <td>{teacher.email}</td>
              <td>{teacher.subjectSpecialization}</td>
              <td>{teacher.dateJoined}</td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(teacher.id)}
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
