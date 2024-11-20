import { useState } from "react";
import DisclaimerPage from "../components/DisclaimerPage";
import Page1 from "../components/Page1";
import Page2 from "../components/Page2";
import Page3 from "../components/Page3";
import Page4 from "../components/Page4";
import ReviewPage from "../components/ReviewPage";
import Header from "../components/Header";
import Otter from "../assets/otterhng.png";
import Otter2 from "../assets/otter2.png";
import Otter3 from "../assets/otter3.png";
import Otter4 from "../assets/otter4.png";
import Otter5 from "../assets/otterpeaking.png";

import "../App.css";
import { useNavigate } from 'react-router-dom';
import {contextRequest} from "../../axios";

function ContextForm() {
  const navigate = useNavigate();
  // State to manage the current page of the multi-page form
  const [currentPage, setCurrentPage] = useState(0); 
  // State to store all form data input by the user
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    occupation: "",
    email: "",
    phone: "",
    website: "",
    courses: "",
    schedule: "",
    objectives: "",
    attendance: "",
    lateAssignments: "",
    faqs: "",
    grading: "",
    importantDates: "",
  });
  // State to manage the modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleFormDataChange = (newData) => {
    setFormData({ ...formData, ...newData });
  };

  const handleNextPage = () => {
    if (currentPage === 4) {
      setCurrentPage(5); 
    } else {
      setCurrentPage((prev) => Math.min(prev + 1, 5));
    }
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };
  // Function to generate the context text from the form data
  const generateContextText = () => {
    const contextText = `
      Personal Information:
      Name: ${formData.name}
      Age: ${formData.age}
      Occupation: ${formData.occupation}
      Email: ${formData.email}
      School Phone: ${formData.phone}
      School Website: ${formData.website}
      
      Courses and Schedule:
      Courses Taught: ${formData.courses}
      Schedule: ${formData.schedule}
      Course Objectives: ${formData.objectives}
      
      Class Policies:
      Attendance: ${formData.attendance}
      Late Assignments: ${formData.lateAssignments}
      FAQs: ${formData.faqs}
      
      Grading and Important Dates:
      Grading Breakdown: ${formData.grading}
      Important Dates: ${formData.importantDates}
    `;
    return contextText;
  };


  const handleSubmit = async () => {
    const contextText = generateContextText();
    
    // Create an object with the contextText to send as JSON
    const data = { context: contextText ,
      name: formData.name,
      emailId: formData.email      
    };
  
    // Send the data to the backend using Axios
    try {
      const response = await contextRequest.post("/saveContext", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.status === 200) {
        console.log("Context saved successfully");
        setIsModalOpen(true);
      } else {
        console.error("Failed to save context");
      }
    } catch (error) {
      console.error("Error saving context", error);
    }
  };

  const handleAcceptDisclaimer = () => {
    setCurrentPage(1); // Move to the first form page after disclaimer acceptance
  };



  return (
    <div className="min-h-screen bg-custom-lightblue">
      <Header />
      <div className="flex-col mt-10 max-w-2xl mx-auto p-6 bg-slate-50 shadow-xl rounded-lg z-2 ">
        {currentPage === 0 && (
          <DisclaimerPage handleAccept={handleAcceptDisclaimer} />
        )}
        {currentPage === 1 && (
          <Page1
            formData={formData}
            handleNextPage={handleNextPage}
            handleFormDataChange={handleFormDataChange}
          />
        )}
        {currentPage === 2 && (
          <Page2
            formData={formData}
            handleNextPage={handleNextPage}
            handlePrevPage={handlePrevPage}
            handleFormDataChange={handleFormDataChange}
          />
        )}
        {currentPage === 3 && (
          <Page3
            formData={formData}
            handleNextPage={handleNextPage}
            handlePrevPage={handlePrevPage}
            handleFormDataChange={handleFormDataChange}
          />
        )}
        {currentPage === 4 && (
          <Page4
            formData={formData}
            handlePrevPage={handlePrevPage}
            handleFormDataChange={handleFormDataChange}
            handleNextPage={handleNextPage}
          />
        )}
        {currentPage === 5 && (
          <ReviewPage
            formData={formData}
            handlePrevPage={handlePrevPage}
            handleSubmit={handleSubmit}
          />
        )}
        {/* Otter image positioned below the form */}
        {currentPage === 0 && (
          <div className="flex justify-start -mb-36">
            <img
              src={Otter}
              alt="Hanging Otter"
              className="w-40 swing-animation"
            />
          </div>
        )}
        {currentPage === 1 && (
          <img
            src={Otter2}
            alt="Standing Otter"
            className="w-64 h-100 bobbing-animation"
            style={{
              position: "absolute",
              top: "60%",
              right: "10%",
            }}
          />
        )}
        {currentPage === 2 && (
          <img
            src={Otter3}
            alt="Standing Otter with box"
            className="w-64 h-100 breathing-animation "
            style={{
              position: "absolute",
              top: "60%",
              right: "75%",
            }}
          />
        )}
        {currentPage === 3 && (
          <img
            src={Otter4}
            alt="Standing Otter with box"
            className="w-64 h-100 breathing-animation "
            style={{
              position: "absolute",
              top: "60%",
              right: "75%",
            }}
          />
        )}
        {currentPage === 4 && (
          <div className="flex justify-start -mb-36">
            <img
              src={Otter}
              alt="Hanging Otter"
              className="w-40 swing-animation"
            />
          </div>
        )}
        {currentPage === 5 && (
          <img
            src={Otter5}
            alt="Otter Peaking"
            className="w-40 h-100  "
            style={{
              position: "absolute",
              top: "-2%",
              right: "27%",
            }}
          />
        )}
         {/* Modal */}
         {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-lg p-6 w-1/2 flex flex-col">
              <h2 className="text-2xl font-semibold mb-4 text-green-600">
                🎉 Context Saved Successfully!
              </h2>
              <p className="text-gray-700 mb-6">
                Your context has been saved. You can now proceed to Grant Gmail Access.
              </p>
              <button
                 onClick={() => navigate('/setuppage')}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Proceed to Grant Access
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContextForm;
