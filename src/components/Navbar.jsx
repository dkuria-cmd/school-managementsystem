import { Navbar, Nav, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AppNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>School Management</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {user && (
              <LinkContainer to="/dashboard">
                <Nav.Link>Dashboard</Nav.Link>
              </LinkContainer>
            )}
            {user && (
              <LinkContainer to="/students">
                <Nav.Link>Students</Nav.Link>
              </LinkContainer>
            )}
            {user && (
              <LinkContainer to="/teachers">
                <Nav.Link>Teachers</Nav.Link>
              </LinkContainer>
            )}
            {user && (
              <LinkContainer to="/courses">
                <Nav.Link>Courses</Nav.Link>
              </LinkContainer>
            )}
            {user && (
              <LinkContainer to="/enrollments">
                <Nav.Link>Enrollments</Nav.Link>
              </LinkContainer>
            )}
            {user && (
              <LinkContainer to="/attendance">
                <Nav.Link>Attendance</Nav.Link>
              </LinkContainer>
            )}
            {user && (
              <LinkContainer to="/exams">
                <Nav.Link>Exams</Nav.Link>
              </LinkContainer>
            )}
            {user && (
              <LinkContainer to="/fees">
                <Nav.Link>Fees</Nav.Link>
              </LinkContainer>
            )}
            {user && (
              <LinkContainer to="/reports">
                <Nav.Link>Reports</Nav.Link>
              </LinkContainer>
            )}
          </Nav>
          <Nav className="ms-auto">
            {user ? (
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            ) : (
              <LinkContainer to="/login">
                <Nav.Link>Login</Nav.Link>
              </LinkContainer>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
