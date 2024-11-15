import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ContextForm from "./pages/ContextForm";
import LandingPage from "./pages/LandingPage";

function App() {
  return(
    <Router>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/contextform" element={<ContextForm />} />
    </Routes>
  </Router>
  );
}

export default App;
