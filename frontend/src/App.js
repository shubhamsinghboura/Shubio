import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./screens/Dashboard";
import Chat from "./screens/Chat";
import About from "./screens/About";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/about" element={<About/>} />
      </Routes>
    </Router>
  );
}

export default App;
