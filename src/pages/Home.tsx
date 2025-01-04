import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, TextField, Typography, Box } from "@mui/material";
import { useAuth } from "../context/AuthContext";

const Home: React.FC = () => {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleCreateRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 8);
    navigate(`/whiteboard/${newRoomId}`);
  };

  const handleJoinRoom = () => {
    if (roomId) {
      navigate(`/whiteboard/${roomId}`);
    }
  };

  const handleViewSessions = () => {
    navigate("/sessions");
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "50px" }}>
      <Typography variant="h4" gutterBottom align="center">
        Collaborative Whiteboard
      </Typography>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateRoom}
          style={{ marginBottom: "20px" }}
        >
          Create Room
        </Button>
        <TextField
          label="Enter Room ID"
          variant="outlined"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          style={{ marginBottom: "20px" }}
          fullWidth
        />
        <Button
          variant="contained"
          color="secondary"
          onClick={handleJoinRoom}
          style={{ marginBottom: "20px" }}
        >
          Join Room
        </Button>
        <Button
          variant="contained"
          color="warning"
          onClick={handleViewSessions}
          style={{ marginBottom: "20px" }}
        >
          View My Sessions
        </Button>
        <Button variant="contained" color="info" onClick={logout}>
          Logout
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
