import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [step, setStep] = useState(1); // Step 1: Authentication, Step 2: Navigate to form
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Handle Gmail Authentication
  const handleGmailAuth = async () => {
    try {
      const response = await axios.post('http://localhost:8100/api/auth'); // Your backend auth endpoint
        console.log(response);
        setIsAuthenticated(true);  // Update the state to trigger re-render
        setStep(2);  // Move to step 2 on successful authentication
    } catch (error) {
      console.error('Error during Gmail authentication:', error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold mb-4">Authenticate to Continue</h1>

        {/* Step 1: Gmail Authentication */}
        {step === 1 && !isAuthenticated && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Step 1: Authorize Gmail Access</h2>
            <p className="mb-4">To proceed, you need to grant access to your Gmail account.</p>
            <button
              className="bg-blue-500 text-white px-6 py-2 rounded-md"
              onClick={handleGmailAuth}
            >
              Grant Gmail Access
            </button>
          </div>
        )}

        {/* Step 2: Go to the Form */}
        {step === 2 && isAuthenticated && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Step 2: Go to Your DashBoard</h2>
            <p className="mb-4">You have successfully authenticated. Now, go to Your Dashboard</p>
            <button
              className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition"
              onClick={() => navigate('/DashBoard')} // Navigate to the form page
            >
              Go to the Form
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;