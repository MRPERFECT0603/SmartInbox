import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ContextForm from "./Pages/ContextForm";
import Steppage from "./Pages/Steppage";
import LandingPage from "./Pages/LandingPage";
import Dashboard from "./Pages/Dashboard";
import LoginPage from "./Pages/LoginPage";

function App() {
  return(
    <div className="pt-4 min-h-screen bg-custom-lightblue">
    <Router>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/contextform" element={<ContextForm />} />
      <Route path="/setuppage" element={<Steppage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/loginpage" element={<LoginPage />} />
    </Routes>
  </Router>
  </div>
  );
}

export default App;
