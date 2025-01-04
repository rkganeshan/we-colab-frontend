import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { List, ListItem, ListItemText } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../context/AuthContext";
import { loadUserSessions } from "../services/socketService";
import { AxiosError } from "axios";

interface Session {
  roomId: string;
  createdAt: string;
}

interface JwtPayload {
  id: string;
}

const Sessions: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
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
      }
    };

    fetchSessions();
  }, []);

  const handleSessionClick = (roomId: string) => {
    navigate(`/whiteboard/${roomId}`);
  };

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
            secondary={`Created At: ${session.createdAt}`}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default Sessions;
