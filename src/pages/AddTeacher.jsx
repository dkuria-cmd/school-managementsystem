import { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createTeacher } from "../api/teacherService";

export default function AddTeacher() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    staffNumber: "",
    subjectSpecialization: "",
    dateJoined: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createTeacher(formData);
      navigate("/teachers");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create teacher");
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "500px" }}>
      <h2 className="mb-4">Add Teacher</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Staff Number</Form.Label>
          <Form.Control
            name="staffNumber"
            value={formData.staffNumber}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Subject Specialization</Form.Label>
          <Form.Control
            name="subjectSpecialization"
            value={formData.subjectSpecialization}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Date Joined</Form.Label>
          <Form.Control
            type="date"
            name="dateJoined"
            value={formData.dateJoined}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Button type="submit" variant="primary">
          Save Teacher
        </Button>
      </Form>
    </Container>
  );
}
