import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  connectSocket,
  getSocket,
  saveSession,
  loadSession,
  joinSession,
} from "../services/socketService";
import rough from "roughjs/bin/rough";
import { useAuth } from "../context/AuthContext";
import {
  Button,
  Container,
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  InputLabel,
  FormControl,
  Avatar,
  Menu,
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { SketchPicker } from "react-color";

interface DrawLine {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  color: string;
  strokeWidth: number;
}

interface DrawShape {
  type: "rectangle" | "circle";
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  strokeWidth: number;
}

type DrawElement = DrawLine | DrawShape;

interface JwtPayload {
  userId: number;
}

const Whiteboard: React.FC = () => {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const [elements, setElements] = useState<DrawElement[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [tool, setTool] = useState("pencil");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const token = localStorage.getItem("token");
  let userId: number | null = null;

  if (token) {
    const decodedToken = jwtDecode<JwtPayload>(token);
    userId = decodedToken.userId;
  }

  const redraw = (elements: DrawElement[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    const roughCanvas = rough.canvas(canvas);

    context?.clearRect(0, 0, canvas.width, canvas.height);
    elements.forEach((element) => {
      if ("type" in element) {
        if (element.type === "rectangle") {
          roughCanvas.rectangle(
            element.x,
            element.y,
            element.width,
            element.height,
            {
              stroke: element.color,
              strokeWidth: element.strokeWidth,
            }
          );
        } else if (element.type === "circle") {
          roughCanvas.circle(element.x, element.y, element.width, {
            stroke: element.color,
            strokeWidth: element.strokeWidth,
          });
        }
      } else {
        roughCanvas.line(element.x0, element.y0, element.x1, element.y1, {
          stroke: element.color,
          strokeWidth: element.strokeWidth,
        });
      }
    });
  };

  const handleMouseDown = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    setIsDrawing(true);
    const { offsetX, offsetY } = getEventOffset(e);
    if (tool === "pencil" || tool === "line") {
      setElements([
        ...elements,
        {
          x0: offsetX,
          y0: offsetY,
          x1: offsetX,
          y1: offsetY,
          color,
          strokeWidth: 2,
        } as DrawLine,
      ]);
    } else if (tool === "rectangle" || tool === "circle") {
      setElements([
        ...elements,
        {
          type: tool,
          x: offsetX,
          y: offsetY,
          width: 0,
          height: 0,
          color,
          strokeWidth: 2,
        } as DrawShape,
      ]);
    }
  };

  const handleMouseMove = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = getEventOffset(e);
    const updatedElements = [...elements];
    const lastIndex = updatedElements.length - 1;

    if (tool === "pencil") {
      updatedElements[lastIndex] = {
        ...(updatedElements[lastIndex] as DrawLine),
        x1: offsetX,
        y1: offsetY,
      };
      setElements([
        ...updatedElements,
        {
          x0: offsetX,
          y0: offsetY,
          x1: offsetX,
          y1: offsetY,
          color,
          strokeWidth: 2,
        } as DrawLine,
      ]);
    } else if (tool === "line") {
      updatedElements[lastIndex] = {
        ...(updatedElements[lastIndex] as DrawLine),
        x1: offsetX,
        y1: offsetY,
      };
      setElements(updatedElements);
    } else if (tool === "rectangle") {
      const { x, y } = updatedElements[lastIndex] as DrawShape;
      updatedElements[lastIndex] = {
        ...(updatedElements[lastIndex] as DrawShape),
        width: offsetX - x,
        height: offsetY - y,
      };
      setElements(updatedElements);
    } else if (tool === "circle") {
      const { x, y } = updatedElements[lastIndex] as DrawShape;
      const radius = Math.sqrt((offsetX - x) ** 2 + (offsetY - y) ** 2);
      updatedElements[lastIndex] = {
        ...(updatedElements[lastIndex] as DrawShape),
        width: radius * 2,
        height: radius * 2,
      };
      setElements(updatedElements);
    } else if (tool === "eraser") {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext("2d");
      const radius = 10;
      context?.clearRect(
        offsetX - radius,
        offsetY - radius,
        radius * 2,
        radius * 2
      );

      const updatedElements = elements.filter((element) => {
        if ("type" in element) {
          if (element.type === "rectangle") {
            const { x, y, width, height } = element as DrawShape;
            return !(
              offsetX >= x &&
              offsetX <= x + width &&
              offsetY >= y &&
              offsetY <= y + height
            );
          } else if (element.type === "circle") {
            const { x, y, width } = element as DrawShape;
            const radius = width / 2;
            const distToCenter = Math.sqrt(
              (offsetX - x) ** 2 + (offsetY - y) ** 2
            );
            return distToCenter > radius;
          }
        } else {
          const line = element as DrawLine;
          const distToPoint = (
            x: number,
            y: number,
            px: number,
            py: number
          ) => {
            return Math.sqrt((x - px) ** 2 + (y - py) ** 2);
          };

          const dist1 = distToPoint(line.x0, line.y0, offsetX, offsetY);
          const dist2 = distToPoint(line.x1, line.y1, offsetX, offsetY);

          const lineLen = Math.sqrt(
            (line.x0 - line.x1) ** 2 + (line.y0 - line.y1) ** 2
          );
          const buffer = 2; // Buffer to consider point on line

          return !(
            dist1 + dist2 >= lineLen - buffer &&
            dist1 + dist2 <= lineLen + buffer
          );
        }
        return true;
      });

      setElements(updatedElements);
      redraw(updatedElements);
      const socket = getSocket();
      if (socket) {
        socket.emit("drawing", { roomId, drawData: updatedElements });
      }
    }
    redraw(updatedElements);
    const socket = getSocket();
    if (socket) {
      socket.emit("drawing", { roomId, drawData: updatedElements });
    }
  };

  const handleMouseUp = (
    _: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    setIsDrawing(false);
    if (tool === "line" || tool === "rectangle" || tool === "circle") {
      const socket = getSocket();
      if (socket) {
        socket.emit("drawing", { roomId, drawData: elements });
      }
    }
  };

  const handleSaveSession = async () => {
    const response = await saveSession(roomId!, elements);
    if (response && response.success) {
      alert("Session saved successfully!");
    } else {
      alert("Error saving session.");
    }
  };

  const handleColorChange = (color: any) => {
    setColor(color.hex);
    // setShowColorPicker(false);
  };

  const handleToolChange = (event: SelectChangeEvent) => {
    setTool(event.target.value);
  };

  const handleProfileMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const getEventOffset = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { offsetX: 0, offsetY: 0 };

    const rect = canvas.getBoundingClientRect();
    let offsetX, offsetY;

    if (e.type.startsWith("mouse")) {
      const event = e as React.MouseEvent<HTMLCanvasElement>;
      offsetX = event.clientX - rect.left;
      offsetY = event.clientY - rect.top;
    } else {
      const event = e as React.TouchEvent<HTMLCanvasElement>;
      const touch = event.touches[0];
      offsetX = touch.clientX - rect.left;
      offsetY = touch.clientY - rect.top;
    }

    return { offsetX, offsetY };
  };

  useEffect(() => {
    const socket = connectSocket(roomId!);

    socket.on("drawing", (drawData: DrawElement[]) => {
      setElements(drawData);
      redraw(drawData);
    });

    const saveInitialSession = async () => {
      const response = await loadSession(roomId!);
      if (response && response.success) {
        setElements(response.drawData);
        redraw(response.drawData);
        await saveSession(roomId!, response.drawData);
      }
      if (userId) {
        await joinSession(userId, Number(roomId!));
      }
    };

    saveInitialSession();

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Container>
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
            navigate("/");
            handleProfileMenuClose();
          }}
        >
          Home
        </MenuItem>
        <MenuItem
          onClick={() => {
            logout();
            handleProfileMenuClose();
          }}
        >
          Logout
        </MenuItem>
      </Menu>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        marginTop={2}
        sx={{
          width: "100%",
          marginTop: "80px !important",
        }}
      >
        <Box
          display="flex"
          flexWrap={"wrap"}
          alignItems="center"
          justifyContent="flex-start"
          width="100%"
          marginBottom={2}
          gap={1}
        >
          <FormControl
            variant="outlined"
            style={{
              marginRight: "10px",
              width: "200px",
            }}
          >
            <InputLabel>Tool</InputLabel>
            <Select value={tool} onChange={handleToolChange}>
              <MenuItem value="pencil">Pencil</MenuItem>
              <MenuItem value="line">Line</MenuItem>
              <MenuItem value="rectangle">Rectangle</MenuItem>
              <MenuItem value="circle">Circle</MenuItem>
              {/* <MenuItem value="eraser">Eraser</MenuItem> */}
            </Select>
          </FormControl>

          <Box position="relative" display="inline-block" marginRight="10px">
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setShowColorPicker(!showColorPicker)}
            >
              Choose Color
            </Button>
            {showColorPicker && (
              <Box position="absolute" zIndex={2} top="100%" left="0">
                <SketchPicker
                  color={color}
                  onChangeComplete={handleColorChange}
                />
              </Box>
            )}
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveSession}
          >
            Save Session
          </Button>
        </Box>
        <Box
          sx={{
            maxWidth: "100%",
            overflowX: "auto",
          }}
        >
          <canvas
            ref={canvasRef}
            width={window.innerWidth}
            height={window.innerHeight}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
            style={{
              border: "1px solid black",
              cursor: tool === "eraser" ? "cell" : "default",
              // maxWidth: "100%",
              height: "auto",
              backgroundColor: "white",
            }}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default Whiteboard;
