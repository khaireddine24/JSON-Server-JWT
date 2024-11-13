import React, { useState } from "react";
import axios from "axios";
import { User, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import { Container, Card, Form, Button, Alert, InputGroup, Spinner } from 'react-bootstrap';

const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/login",
        { username, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true
        }
      );

      const { token, admin } = response.data;
      localStorage.setItem("token", token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      onLogin(admin);
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error.response?.data?.message || 
        "An error occurred during login. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container fluid className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
      <Card className="shadow border-0" style={{ maxWidth: '400px' }}>
        <Card.Body className="p-5">
          <div className="text-center mb-4">
            <div className="bg-primary rounded-circle p-3 d-inline-flex align-items-center justify-content-center mb-3">
              <LogIn className="text-white" size={24} />
            </div>
            <h2 className="fw-bold">Admin Login</h2>
            <p className="text-muted">Please sign in to access your account</p>
          </div>

          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <InputGroup>
                <InputGroup.Text className="bg-light">
                  <User size={18} className="text-muted" />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-4">
              <InputGroup>
                <InputGroup.Text className="bg-light">
                  <Lock size={18} className="text-muted" />
                </InputGroup.Text>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <InputGroup.Text 
                  className="bg-light cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: 'pointer' }}
                >
                  {showPassword ? 
                    <EyeOff size={18} className="text-muted" /> : 
                    <Eye size={18} className="text-muted" />
                  }
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>

            {error && (
              <Alert variant="danger">
                {error}
              </Alert>
            )}

            <Button 
              variant="primary" 
              type="submit" 
              className="w-100 py-2 mt-3" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn size={18} className="me-2" />
                  Sign in
                </>
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminLogin;