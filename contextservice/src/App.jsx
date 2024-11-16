import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ContextForm from "./Pages/ContextForm";
import Steppage from "./Pages/Steppage";
import LandingPage from "./Pages/LandingPage";
import Dashboard from "./Pages/Dashboard";

function App() {
  return(
    <Router>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/contextform" element={<ContextForm />} />
      <Route path="/setuppage" element={<Steppage />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  </Router>
  );
}

export default App;
