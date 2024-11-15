import { useState } from 'react';
import DisclaimerPage from './components/DisclaimerPage';
import Page1 from './components/Page1';
import Page2 from './components/Page2';
import Page3 from './components/Page3';
import Page4 from './components/Page4';
import ReviewPage from './components/ReviewPage';
import Header from './components/Header';
import Otter from './assets/otterhng.png';
import Otter2 from './assets/otter2.png';
import Otter3 from './assets/otter3.png';
import Otter4 from './assets/otter4.png';
import Otter5 from './assets/otterpeaking.png';




import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState(0); // 0 for disclaimer page
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    occupation: '',
    email: '',
    phone: '',
    website: '',
    courses: '',
    schedule: '',
    objectives: '',
    attendance: '',
    lateAssignments: '',
    faqs: '',
    grading: '',
    importantDates: ''
  });

  const handleFormDataChange = (newData) => {
    setFormData({ ...formData, ...newData });
  };

  const handleNextPage = () => {
    if (currentPage === 4) {
      setCurrentPage(5); // Go to the review page after Page4
    } else {
      setCurrentPage((prev) => Math.min(prev + 1, 5)); // Allow navigation to the review page
    }
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

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

  const handleSubmit = () => {
    const contextText = generateContextText();

    // Create a Blob with the context text
    const blob = new Blob([contextText], { type: 'text/plain' });

    // Create a download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'context.txt';

    // Trigger the download
    link.click();
  };

  const handleAcceptDisclaimer = () => {
    setCurrentPage(1); // Move to the first form page after disclaimer acceptance
  };

  return (
    <div className='min-h-screen bg-custom-lightblue'>
      <Header />
    <div className="flex-col mt-10 max-w-2xl mx-auto p-6 bg-slate-50 shadow-xl rounded-lg z-2 ">
      {currentPage === 0 && <DisclaimerPage handleAccept={handleAcceptDisclaimer} />}
      {currentPage === 1 && <Page1 formData={formData} handleNextPage={handleNextPage} handleFormDataChange={handleFormDataChange} />}
      {currentPage === 2 && <Page2 formData={formData} handleNextPage={handleNextPage} handlePrevPage={handlePrevPage} handleFormDataChange={handleFormDataChange} />}
      {currentPage === 3 && <Page3 formData={formData} handleNextPage={handleNextPage} handlePrevPage={handlePrevPage} handleFormDataChange={handleFormDataChange} />}
      {currentPage === 4 && <Page4 formData={formData} handlePrevPage={handlePrevPage} handleFormDataChange={handleFormDataChange} handleNextPage={handleNextPage} />}
      {currentPage === 5 && <ReviewPage formData={formData} handlePrevPage={handlePrevPage} handleSubmit={handleSubmit} />}
      {/* Otter image positioned below the form */}
      {currentPage === 0 && (
          <div className="flex justify-start -mb-36">
            <img src={Otter} alt="Hanging Otter" className="w-40 swing-animation" />
          </div>
        )}
      {currentPage === 1 && (
      <img
        src={Otter2}
        alt="Standing Otter"
        className="w-64 h-100 bobbing-animation"
        style={{
          position: 'absolute',
          top: '60%',
          right: '10%',
        }}
      />
    )}
    {currentPage === 2 && (
      <img
        src={Otter3}
        alt="Standing Otter with box"
        className="w-64 h-100 breathing-animation "
        style={{
          position: 'absolute',
          top: '60%',
          right: '75%',
        }}
      />
    )}
    {currentPage === 3 && (
      <img
        src={Otter4}
        alt="Standing Otter with box"
        className="w-64 h-100 breathing-animation "
        style={{
          position: 'absolute',
          top: '60%',
          right: '75%',
        }}
      />
    )}
    {currentPage === 4 && (
          <div className="flex justify-start -mb-36">
            <img src={Otter} alt="Hanging Otter" className="w-40 swing-animation" />
          </div>
        )}
      {currentPage === 5 && (
      <img
        src={Otter5}
        alt="Otter Peaking"
        className="w-40 h-100  "
        style={{
          position: 'absolute',
          top: '-2%',
          right: '27%',
        }}
      />
    )}
    </div>
    </div>
  );
}

export default App;