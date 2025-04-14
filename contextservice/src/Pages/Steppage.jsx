import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Otter5 from "../assets/otterpeaking.png";
import {contextRequest} from "../../axios";
import { useLocation } from 'react-router-dom';

const AuthPage = () => {
  const [step, setStep] = useState(1); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  console.log("VivekHello"+email);
  
  // Handle Gmail Authentication
  const handleGmailAuth = async () => {
    try {
      const response = await contextRequest.post("/auth", {
        email
      });
      console.log(response);
      setIsAuthenticated(true); 
      setStep(2); 
    } catch (error) {
      console.error("Error during Gmail authentication:", error);
    }
  };

  return (
    <div>
      <Header />
      <div className="flex flex-col justify-center items-center min-h-screen bg-custom-lightblue pb-32">
        <div className="max-w-lg mx-auto p-8 bg-white shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
            Authenticate to Continue
          </h1>

          {/* Step 1: Gmail Authentication */}
          {step === 1 && !isAuthenticated && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Step 1 : Authorize Gmail Access
              </h2>
              <p className="text-gray-700 mb-4">
                To proceed, you need to grant access to your Gmail account.
              </p>
              <button
                className="w-full py-2 px-6 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                onClick={handleGmailAuth}
              >
                Grant Gmail Access
              </button>
            </div>
          )}

          {/* Step 2: Go to the Form */}
          {step === 2 && isAuthenticated && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Step 2: Go to Your DashBoard
              </h2>
              <p className="text-gray-700 mb-4">
                You have successfully authenticated. Now, go to Your Dashboard.
              </p>
              <button
                className="w-full py-2 px-6 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                onClick={() => navigate("/DashBoard" , { state: { email: location.state.email } })} 
              >
                Go to the Dashboard
              </button>
            </div>
          )}
          {step === 1 && (
          <img
            src={Otter5}
            alt="Otter Peaking"
            className="w-40 h-100 "
            style={{
              position: "absolute",
              top: "21%",
              right: "32%",
            }}
          />
        )}
          {step === 2 && (
          <img
            src={Otter5}
            alt="Otter Peaking"
            className="w-40 h-100 "
            style={{
              position: "absolute",
              top: "19%",
              right: "32%",
            }}
          />
        )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
