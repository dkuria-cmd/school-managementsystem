import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Table, Badge } from "react-bootstrap";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "../context/AuthContext";
import { getAllStudents } from "../api/studentService";
import { getAllTeachers } from "../api/teacherService";
import { getAllCourses } from "../api/courseService";
import { getAllFees } from "../api/feeService";
import { getAllAttendance } from "../api/attendanceService";
import { getAllEnrollments } from "../api/enrollmentService";

const STATUS_COLORS = {
  PAID: "#28a745",
  PARTIAL: "#ffc107",
  UNPAID: "#dc3545",
  PRESENT: "#28a745",
  ABSENT: "#dc3545",
};

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({ students: 0, teachers: 0, classes: 0 });
  const [feeChartData, setFeeChartData] = useState([]);
  const [attendanceChartData, setAttendanceChartData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [
          studentsRes,
          teachersRes,
          coursesRes,
          feesRes,
          attendanceRes,
          enrollmentsRes,
        ] = await Promise.all([
          getAllStudents(),
          getAllTeachers(),
          getAllCourses(),
          getAllFees(),
          getAllAttendance(),
          getAllEnrollments(),
        ]);

        setStats({
          students: studentsRes.data.length,
          teachers: teachersRes.data.length,
          classes: coursesRes.data.length,
        });

        // Fee status breakdown
        const feeCounts = { PAID: 0, PARTIAL: 0, UNPAID: 0 };
        feesRes.data.forEach((fee) => {
          feeCounts[fee.status] = (feeCounts[fee.status] || 0) + 1;
        });
        setFeeChartData(
          Object.entries(feeCounts)
            .filter(([, count]) => count > 0)
            .map(([status, count]) => ({ name: status, value: count })),
        );

        // Attendance breakdown
        const attendanceCounts = { PRESENT: 0, ABSENT: 0 };
        attendanceRes.data.forEach((record) => {
          attendanceCounts[record.status] =
            (attendanceCounts[record.status] || 0) + 1;
        });
        setAttendanceChartData([
          { name: "Present", count: attendanceCounts.PRESENT },
          { name: "Absent", count: attendanceCounts.ABSENT },
        ]);

        // Recent activity: combine enrollments + fee records, sorted by most recent
        const enrollmentActivity = enrollmentsRes.data.map((e) => ({
          type: "Enrollment",
          description: `${e.student.firstName} ${e.student.lastName} enrolled in ${e.course.courseName}`,
          date: e.enrolledOn,
        }));

        const feeActivity = feesRes.data.map((f) => ({
          type: "Fee",
          description: `${f.student.firstName} ${f.student.lastName} — ${f.feeType} (${f.status})`,
          date: f.dueDate,
        }));

        const combined = [...enrollmentActivity, ...feeActivity]
          .filter((a) => a.date)
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 8);

        setRecentActivity(combined);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <Container className="mt-5">
      <h1>Welcome, {user?.firstName || "Admin"}</h1>
      <p>Here's an overview of your school.</p>

      <Row className="mt-4 mb-4">
        <Col md={4}>
          <Card className="text-center p-3">
            <h2>{stats.students}</h2>
            <p className="mb-0">Total Students</p>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center p-3">
            <h2>{stats.teachers}</h2>
            <p className="mb-0">Total Teachers</p>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center p-3">
            <h2>{stats.classes}</h2>
            <p className="mb-0">Total Classes</p>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={3}>
          <h3>Quick Actions</h3>
          <div className="d-grid gap-2">
            <button
              className="btn btn-outline-primary"
              onClick={() => navigate("/students/add")}
            >
              Add Student
            </button>
            <button
              className="btn btn-outline-primary"
              onClick={() => navigate("/teachers/add")}
            >
              Add Teacher
            </button>
            <button
              className="btn btn-outline-primary"
              onClick={() => navigate("/attendance")}
            >
              View Attendance
            </button>
          </div>
        </Col>

        <Col md={4}>
          <Card className="p-3">
            <h5>Fee Status</h5>
            {!loading && feeChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={feeChartData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    label
                  >
                    {feeChartData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={STATUS_COLORS[entry.name] || "#8884d8"}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted">No fee data yet.</p>
            )}
          </Card>
        </Col>

        <Col md={5}>
          <Card className="p-3">
            <h5>Attendance (Present vs Absent)</h5>
            {!loading && attendanceChartData.some((d) => d.count > 0) ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={attendanceChartData}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count">
                    {attendanceChartData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={
                          entry.name === "Present"
                            ? STATUS_COLORS.PRESENT
                            : STATUS_COLORS.ABSENT
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted">No attendance data yet.</p>
            )}
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <h3>Recent Activity</h3>
          {recentActivity.length === 0 ? (
            <p className="text-muted">No recent activity yet.</p>
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((activity, index) => (
                  <tr key={index}>
                    <td>
                      <Badge
                        bg={activity.type === "Enrollment" ? "primary" : "info"}
                      >
                        {activity.type}
                      </Badge>
                    </td>
                    <td>{activity.description}</td>
                    <td>{activity.date}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
