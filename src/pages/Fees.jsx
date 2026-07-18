import { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Alert,
  Form,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import { getAllFees, createFee, payFee } from "../api/feeService";
import { getAllStudents } from "../api/studentService";

export default function Fees() {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");

  const [studentId, setStudentId] = useState("");
  const [feeType, setFeeType] = useState("");
  const [amountDue, setAmountDue] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [paymentInputs, setPaymentInputs] = useState({});

  const loadData = async () => {
    setError("");
    try {
      const [feesRes, studentsRes] = await Promise.all([
        getAllFees(),
        getAllStudents(),
      ]);
      setFees(feesRes.data);
      setStudents(studentsRes.data);
    } catch (err) {
      setError("Failed to load fees");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddFee = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createFee({
        studentId: parseInt(studentId),
        feeType,
        amountDue: parseFloat(amountDue),
        dueDate,
      });
      setStudentId("");
      setFeeType("");
      setAmountDue("");
      setDueDate("");
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create fee");
    }
  };

  const handlePaymentInputChange = (feeId, value) => {
    setPaymentInputs({ ...paymentInputs, [feeId]: value });
  };

  const handlePay = async (feeId) => {
    const amount = parseFloat(paymentInputs[feeId]);
    if (isNaN(amount) || amount <= 0) return;
    setError("");
    try {
      await payFee(feeId, amount);
      setPaymentInputs({ ...paymentInputs, [feeId]: "" });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to record payment");
    }
  };

  const statusColor = (status) => {
    if (status === "PAID") return "success";
    if (status === "PARTIAL") return "warning";
    return "danger";
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Fee Management</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleAddFee} className="mb-4">
        <Row className="align-items-end">
          <Col md={3}>
            <Form.Label>Student</Form.Label>
            <Form.Select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            >
              <option value="">Select a student</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.firstName} {s.lastName}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Label>Fee Type</Form.Label>
            <Form.Control
              value={feeType}
              onChange={(e) => setFeeType(e.target.value)}
              placeholder="e.g. Tuition"
              required
            />
          </Col>
          <Col md={2}>
            <Form.Label>Amount Due</Form.Label>
            <Form.Control
              type="number"
              value={amountDue}
              onChange={(e) => setAmountDue(e.target.value)}
              required
            />
          </Col>
          <Col md={2}>
            <Form.Label>Due Date</Form.Label>
            <Form.Control
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </Col>
          <Col md={2}>
            <Button type="submit" variant="primary">
              Add Fee
            </Button>
          </Col>
        </Row>
      </Form>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Student</th>
            <th>Fee Type</th>
            <th>Amount Due</th>
            <th>Amount Paid</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Record Payment</th>
          </tr>
        </thead>
        <tbody>
          {fees.map((fee) => (
            <tr key={fee.id}>
              <td>
                {fee.student.firstName} {fee.student.lastName}
              </td>
              <td>{fee.feeType}</td>
              <td>{fee.amountDue}</td>
              <td>{fee.amountPaid}</td>
              <td>
                <Badge bg={statusColor(fee.status)}>{fee.status}</Badge>
              </td>
              <td>{fee.dueDate}</td>
              <td>
                {fee.status !== "PAID" ? (
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="number"
                      style={{ width: "100px" }}
                      placeholder="Amount"
                      value={paymentInputs[fee.id] || ""}
                      onChange={(e) =>
                        handlePaymentInputChange(fee.id, e.target.value)
                      }
                    />
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handlePay(fee.id)}
                    >
                      Pay
                    </Button>
                  </div>
                ) : (
                  <span className="text-muted">Fully paid</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
