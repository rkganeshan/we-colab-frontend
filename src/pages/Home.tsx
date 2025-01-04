import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  TextField,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Menu,
  MenuItem,
  Grid,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { loadSession } from "../services/socketService";
import Sessions from "./Sessions";

const Home: React.FC = () => {
  const [roomId, setRoomId] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleCreateRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 8);
    navigate(`/whiteboard/${newRoomId}`);
  };

  const handleJoinRoom = async () => {
    if (roomId) {
      try {
        const response = await loadSession(roomId, "join");

        if (response && response.success) {
          navigate(`/whiteboard/${roomId}`);
        } else {
          alert("No such room exists.");
        }
      } catch (error) {
        alert("Error checking room. Please try again.");
      }
    }
  };

  const handleProfileMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Container
      style={{
        minWidth: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "50px",
      }}
    >
      {/* Avatar & Menu */}
      <Box
        position="absolute"
        top={16}
        right={16}
        onClick={handleProfileMenuClick}
        style={{ cursor: "pointer" }}
      >
        <Avatar src="/static/images/avatar/1.jpg" />
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
      >
        <MenuItem
          onClick={() => {
            logout();
            handleProfileMenuClose();
          }}
        >
          Logout
        </MenuItem>
      </Menu>

      <Grid
        container
        spacing={2}
        sx={{
          maxWidth: "900px",
          width: "100%",
          marginTop: "0px !important",
        }}
      >
        {/* Left Card - Room Creation & Joining */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              boxShadow: 3,
              display: "flex",
              flexDirection: "column",
              height: "auto",
              padding: "16px",
            }}
          >
            <CardContent style={{ flexGrow: 1 }}>
              <Typography variant="h5" gutterBottom align="center">
                Create or Join Room
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateRoom}
                fullWidth
                style={{
                  marginBottom: "16px",
                  fontWeight: "bold",
                  padding: "12px",
                }}
              >
                Create Room
              </Button>
              <TextField
                placeholder="Enter Room ID to join a room"
                variant="outlined"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                style={{
                  marginBottom: "16px",
                  backgroundColor: "#fff",
                  borderRadius: "4px",
                  width: "100%",
                }}
                fullWidth
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleJoinRoom}
                fullWidth
                style={{
                  marginBottom: "16px",
                  fontWeight: "bold",
                  padding: "12px",
                }}
                disabled={!roomId}
              >
                Join Room
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Card - View Sessions */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              boxShadow: 3,
              display: "flex",
              flexDirection: "column",
              height: "auto",
              maxHeight: "75vh",
              padding: "16px",
            }}
          >
            <CardContent style={{ flexGrow: 1 }}>
              <Typography variant="h5" gutterBottom align="center">
                My Boards
              </Typography>
              <Sessions />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
