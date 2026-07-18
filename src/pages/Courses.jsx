import { useState, useEffect } from "react";
import { Container, Table, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getAllCourses, deleteCourse } from "../api/courseService";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");

  const loadCourses = async () => {
    try {
      const response = await getAllCourses();
      setCourses(response.data);
    } catch (err) {
      setError("Failed to load courses");
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      await deleteCourse(id);
      loadCourses();
    } catch (err) {
      setError("Failed to delete course");
    }
  };

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Courses</h2>
        <Link to="/courses/add">
          <Button variant="primary">Add Course</Button>
        </Link>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Course Name</th>
            <th>Class Level</th>
            <th>Teacher</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td>{course.courseCode}</td>
              <td>{course.courseName}</td>
              <td>{course.classLevel}</td>
              <td>
                {course.teacher
                  ? `${course.teacher.firstName} ${course.teacher.lastName}`
                  : "—"}
              </td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(course.id)}
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
