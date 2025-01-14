import React, { useEffect, useState } from "react";
import {
  Table,
  Container,
  Spinner,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [newCustomer, setNewCustomer] = useState({
    customerName: "",
    email: "",
    location: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8081/api/customers", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setCustomers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const handleEditClick = (customer) => {
    setCurrentCustomer(customer);
    setShowEditModal(true);
  };

  const handleAddClick = () => {
    setNewCustomer({ customerName: "", email: "", location: "" });
    setShowAddModal(true);
  };

  const deleteCustomer = (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      fetch(`http://localhost:8081/api/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
        .then((response) => {
          if (response.ok) {
            setCustomers(customers.filter((customer) => customer.id !== id));
            alert("Customer deleted successfully");
          } else {
            alert("Failed to delete customer");
          }
        })
        .catch((error) => console.error("Error deleting customer:", error));
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();

    fetch(`http://localhost:8081/api/update/${currentCustomer.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(currentCustomer),
    })
      .then((response) => {
        if (response.ok) {
          setCustomers(
            customers.map((customer) =>
              customer.id === currentCustomer.id ? currentCustomer : customer
            )
          );
          alert("Customer updated successfully");
        } else {
          alert("Failed to update customer");
        }
        setShowEditModal(false);
      })
      .catch((error) => console.error("Error updating customer:", error));
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:8081/api/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(newCustomer),
    })
      .then((response) => response.json())
      .then((data) => {
        setCustomers([...customers, data]);
        alert("Customer added successfully");
        setShowAddModal(false);
      })
      .catch((error) => console.error("Error adding customer:", error));
  };

  const handleInputChange = (e, isEdit = false) => {
    const { name, value } = e.target;
    if (isEdit) {
      setCurrentCustomer({ ...currentCustomer, [name]: value });
    } else {
      setNewCustomer({ ...newCustomer, [name]: value });
    }
  };
   const handleLogout = () => {
     localStorage.removeItem("jwtToken");
     navigate("/");
  };
  
const logoutButtonStyle = {
  position: "absolute",
  top: "20px",
  right: "20px",
  padding: "10px 15px",
  backgroundColor: "red",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};


  return (
    <Container>
      <h2 className="my-4">Customer List</h2>
      <button onClick={handleLogout} style={logoutButtonStyle}>
        Logout
      </button>
      <Button variant="primary" className="mb-3" onClick={handleAddClick}>
        <FaPlus /> Add Customer
      </Button>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p>Loading...</p>
        </div>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer Name</th>
              <th>Email</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>{customer.customerName}</td>
                <td>{customer.email}</td>
                <td>{customer.location}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEditClick(customer)}
                  >
                    <FaEdit /> Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => deleteCustomer(customer.id)}
                  >
                    <FaTrash /> Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentCustomer && (
            <Form onSubmit={handleEditSubmit}>
              <Form.Group className="mb-3" controlId="customerName">
                <Form.Label>Customer Name</Form.Label>
                <Form.Control
                  type="text"
                  name="customerName"
                  value={currentCustomer.customerName}
                  onChange={(e) => handleInputChange(e, true)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={currentCustomer.email}
                  onChange={(e) => handleInputChange(e, true)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="location">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  value={currentCustomer.location}
                  onChange={(e) => handleInputChange(e, true)}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddSubmit}>
            <Form.Group className="mb-3" controlId="customerName">
              <Form.Label>Customer Name</Form.Label>
              <Form.Control
                type="text"
                name="customerName"
                value={newCustomer.customerName}
                onChange={(e) => handleInputChange(e)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={newCustomer.email}
                onChange={(e) => handleInputChange(e)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="location">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={newCustomer.location}
                onChange={(e) => handleInputChange(e)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Add Customer
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Dashboard;
