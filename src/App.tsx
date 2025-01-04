import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Whiteboard from "./pages/Whiteboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Sessions from "./pages/Sessions";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/whiteboard/:roomId" element={<Whiteboard />} />
            <Route path="/sessions" element={<Sessions />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
