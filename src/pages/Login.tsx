import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Link,
} from "@mui/material";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import config from "../config";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${config.API_BASE_URL}/api/auth/login`,
        { email, password }
      );
      if (response.data.success) {
        login(response.data.token);
      } else {
        alert("Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login error");
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "50px" }}>
      <Typography variant="h4" gutterBottom align="center">
        Login
      </Typography>
      <Box display="flex" flexDirection="column" alignItems="center">
        <TextField
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: "20px" }}
          fullWidth
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: "20px" }}
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
          style={{ marginBottom: "20px" }}
        >
          Login
        </Button>
        <Typography variant="body2">
          Don't have an account?{" "}
          <Link onClick={() => navigate("/register")} variant="body2">
            Sign Up
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
