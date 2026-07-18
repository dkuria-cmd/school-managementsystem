import { useState, useEffect } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createCourse } from "../api/courseService";
import { getAllTeachers } from "../api/teacherService";

export default function AddCourse() {
  const [formData, setFormData] = useState({
    courseName: "",
    courseCode: "",
    classLevel: "",
    teacherId: "",
  });
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadTeachers = async () => {
      try {
        const response = await getAllTeachers();
        setTeachers(response.data);
      } catch (err) {
        setError("Failed to load teachers");
      }
    };
    loadTeachers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        courseName: formData.courseName,
        courseCode: formData.courseCode,
        classLevel: formData.classLevel,
        teacher: { id: parseInt(formData.teacherId) },
      };
      await createCourse(payload);
      navigate("/courses");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create course");
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "500px" }}>
      <h2 className="mb-4">Add Course</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Course Name</Form.Label>
          <Form.Control
            name="courseName"
            value={formData.courseName}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Course Code</Form.Label>
          <Form.Control
            name="courseCode"
            value={formData.courseCode}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Class Level</Form.Label>
          <Form.Control
            name="classLevel"
            placeholder="e.g. Grade 10"
            value={formData.classLevel}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Teacher</Form.Label>
          <Form.Select
            name="teacherId"
            value={formData.teacherId}
            onChange={handleChange}
            required
          >
            <option value="">Select a teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.firstName} {teacher.lastName} (
                {teacher.subjectSpecialization})
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Button type="submit" variant="primary">
          Save Course
        </Button>
      </Form>
    </Container>
  );
}
