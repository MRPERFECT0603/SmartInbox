import PropTypes from 'prop-types';


/**
 * Review Datra Component
 * Renders the final page of a multi-step form for reviewing all the data the user has submitted.
 */
function ReviewPage({ formData, handlePrevPage, handleSubmit }) {
  return (
    <div className="h-screen flex flex-col bg-gray-100 max-h-[calc(100vh-200px)]">
      {/* Header Section */}
      <header className="bg-white shadow-md p-4">
        <h2 className="text-2xl font-semibold text-gray-800">Review Your Data</h2>
      </header>

      {/* Scrollable Content */}
      <main className="flex-1 overflow-y-auto p-6 ">
        {/* Personal Information */}
        <div className="space-y-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-700">Personal Information</h3>
          <p><strong className="text-gray-600">Name:</strong> {formData.name}</p>
          <p><strong className="text-gray-600">Age:</strong> {formData.age}</p>
          <p><strong className="text-gray-600">Occupation:</strong> {formData.occupation}</p>
          <p><strong className="text-gray-600">Email:</strong> {formData.email}</p>
          <p><strong className="text-gray-600">Password:</strong> {formData.password}</p>
          <p><strong className="text-gray-600">Website:</strong> {formData.website}</p>
        </div>

        {/* Courses and Schedule */}
        <div className="space-y-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-700">Courses and Schedule</h3>
          <p><strong className="text-gray-600">Courses Taught:</strong> {formData.courses}</p>
          <p><strong className="text-gray-600">Schedule:</strong> {formData.schedule}</p>
          <p><strong className="text-gray-600">Course Objectives:</strong> {formData.objectives}</p>
        </div>

        {/* Class Policies */}
        <div className="space-y-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-700">Class Policies</h3>
          <p><strong className="text-gray-600">Attendance:</strong> {formData.attendance}</p>
          <p><strong className="text-gray-600">Late Assignments:</strong> {formData.lateAssignments}</p>
          <p><strong className="text-gray-600">FAQs:</strong> {formData.faqs}</p>
        </div>

        {/* Grading and Important Dates */}
        <div className="space-y-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-700">Grading and Important Dates</h3>
          <p><strong className="text-gray-600">Grading Breakdown:</strong> {formData.grading}</p>
          <p><strong className="text-gray-600">Important Dates:</strong> {formData.importantDates}</p>
        </div>
      </main>

      {/* Fixed Footer Buttons */}
      <footer className="bg-white shadow-inner p-4 flex justify-between">
        <button
          onClick={handlePrevPage}
          className="bg-gray-500 text-white rounded-md px-6 py-2 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          Previous
        </button>
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white rounded-md px-6 py-2 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          Submit and Save
        </button>
      </footer>
    </div>
  );
}

ReviewPage.propTypes = {
  formData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    age: PropTypes.string.isRequired,
    occupation: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    website: PropTypes.string.isRequired,
    courses: PropTypes.string.isRequired,
    schedule: PropTypes.string.isRequired,
    objectives: PropTypes.string.isRequired,
    attendance: PropTypes.string.isRequired,
    lateAssignments: PropTypes.string.isRequired,
    faqs: PropTypes.string.isRequired,
    grading: PropTypes.string.isRequired,
    importantDates: PropTypes.string.isRequired
  }).isRequired,
  handlePrevPage: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
};

export default ReviewPage;