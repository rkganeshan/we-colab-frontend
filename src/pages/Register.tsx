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
import config from "../config";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post(
        `${config.API_BASE_URL}/api/auth/register`,
        { email, password }
      );
      if (response.data.success) {
        navigate("/login");
      } else {
        alert("Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration error");
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "50px" }}>
      <Typography variant="h4" gutterBottom align="center">
        Register
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
          onClick={handleRegister}
          style={{ marginBottom: "20px" }}
        >
          Register
        </Button>
        <Typography variant="body2">
          Already have an account?{" "}
          <Link href="/login" variant="body2">
            Login
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Register;
