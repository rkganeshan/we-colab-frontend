import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Chip,
  List,
  ListItem,
  ListItemText,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../context/AuthContext";
import { loadUserSessions } from "../services/socketService";
import { AxiosError } from "axios";
import { formatDateTime } from "../utils";

interface Session {
  roomId: string;
  createdAt: string;
}

interface JwtPayload {
  id: string;
}

const Sessions: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decoded = jwtDecode<JwtPayload>(token);
          const userId = parseInt(decoded.id, 10); // Ensure userId is a number

          const response = await loadUserSessions(userId); // Use the function from socketService
          if (response && response.success) {
            setSessions(response.sessions);
          }
        }
      } catch (error) {
        console.error("Error fetching sessions:", error);
        if (
          (error as AxiosError).response &&
          (error as AxiosError).status === 401
        ) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const handleSessionClick = (roomId: string) => {
    navigate(`/whiteboard/${roomId}`);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        marginTop="40px"
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading sessions...</Typography>
      </Box>
    );
  }

  if (sessions.length === 0) {
    return (
      <Box textAlign="center" mt={3}>
        <Typography>No boards found.</Typography>
      </Box>
    );
  }

  return (
    <List
      sx={{
        overflowY: "auto",
        maxHeight: "65vh",
        padding: "8px",
      }}
    >
      {sessions.map((session) => (
        <ListItem
          key={session.roomId}
          onClick={() => handleSessionClick(session.roomId)}
          component="li"
          sx={{
            border: "1px solid black",
            borderRadius: "8px",
            padding: "2",
            cursor: "pointer",
            marginTop: "4px",
          }}
        >
          <ListItemText
            primary={`Room: ${session.roomId}`}
            secondary={
              <Chip
                label={`Created At: ${formatDateTime(session.createdAt)}`}
                color="success"
                size="small"
              />
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default Sessions;
