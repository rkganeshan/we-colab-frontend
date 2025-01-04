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
import config from "../config";
import { useTypewriter } from "../hooks/useTypewriter";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const typewriterText = useTypewriter(
    "Join We Colab and Start Collaborating Today!",
    100,
    1500
  );

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
            Register
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
              onClick={handleRegister}
            >
              Register
            </Button>
            <Typography variant="body2" style={{ color: "white" }}>
              Already have an account?&nbsp;
              <Link
                onClick={() => navigate("/login")}
                style={{
                  color: "#ffeb3b",
                  cursor: "pointer",
                }}
              >
                Login
              </Link>
            </Typography>
          </Box>
        </Container>
      </Grid>
    </Grid>
  );
};

export default Register;
