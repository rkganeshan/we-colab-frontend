import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import config from "../config";
import { useTypewriter } from "../hooks/useTypewriter";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

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

  const typewriterText = useTypewriter(
    "We Colab - A collaborative whiteboard",
    100,
    1500
  );

  return (
    <Grid container style={{ height: "100vh" }}>
      {/* Left Section */}
      {!isSmallScreen && (
        <Grid
          item
          xs={12}
          md={6}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f0f0f0",
          }}
        >
          <Typography
            variant="h3"
            style={{
              fontFamily: "'Courier New', Courier, monospace",
              textAlign: "center",
              padding: "20px",
            }}
          >
            {typewriterText}
          </Typography>
        </Grid>
      )}

      {/* Right Section with Gradient */}
      <Grid
        item
        xs={12}
        md={6}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to bottom right, #11998e, #38ef7d)",
          color: "white",
        }}
      >
        <Container maxWidth="xs">
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            style={{ color: "white" }}
          >
            Login
          </Typography>
          <Box display="flex" flexDirection="column" alignItems="center">
            <TextField
              placeholder="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                marginBottom: "20px",
                backgroundColor: "white",
                borderRadius: "4px",
              }}
              fullWidth
            />
            <TextField
              placeholder="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                marginBottom: "20px",
                backgroundColor: "white",
                borderRadius: "4px",
              }}
              fullWidth
            />
            <Button
              variant="contained"
              style={{
                marginBottom: "20px",
                backgroundColor: "#2575fc",
                color: "white",
                fontWeight: "bold",
              }}
              onClick={handleLogin}
            >
              Login
            </Button>
            <Typography variant="body2" style={{ color: "white" }}>
              Don't have an account?{" "}
              <Link
                onClick={() => navigate("/register")}
                style={{
                  color: "#ffeb3b",
                  cursor: "pointer",
                }}
              >
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Container>
      </Grid>
    </Grid>
  );
};

export default Login;
