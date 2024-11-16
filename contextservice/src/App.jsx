import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ContextForm from "./Pages/ContextForm";
import Steppage from "./Pages/Steppage";
import LandingPage from "./Pages/LandingPage";

function App() {
  return(
    <Router>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/contextform" element={<ContextForm />} />
      <Route path="/setuppage" element={<Steppage />} />
    </Routes>
  </Router>
  );
}

export default App;
