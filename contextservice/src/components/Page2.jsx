import PropTypes from 'prop-types';


/**
 * Page2 Component
 * Renders the Second page of a multi-step form for collecting Courses and Schedule.
 */
function Page2({ formData, handleNextPage, handlePrevPage, handleFormDataChange }) {
  const handleChange = (e) => {
    handleFormDataChange({ [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Page 2: Courses and Schedule</h2>
      <div className="space-y-6">
        {/* Course Taught Input Field */}
        <div>
          <label htmlFor="courses" className="block text-sm font-medium text-gray-700">Courses Taught</label>
          <textarea
            id="courses"
            name="courses"
            value={formData.courses}
            onChange={handleChange}
            rows="4"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter the courses you teach"
          />
        </div>
        {/* Schedule Input Field */}
        <div>
          <label htmlFor="schedule" className="block text-sm font-medium text-gray-700">Schedule</label>
          <textarea
            id="schedule"
            name="schedule"
            value={formData.schedule}
            onChange={handleChange}
            rows="4"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter your weekly schedule"
          />
        </div>
        {/* Course Objective Input Field */}
        <div>
          <label htmlFor="objectives" className="block text-sm font-medium text-gray-700">Course Objectives</label>
          <textarea
            id="objectives"
            name="objectives"
            value={formData.objectives}
            onChange={handleChange}
            rows="4"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter the course objectives"
          />
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={handlePrevPage}
            className="py-2 px-4 bg-gray-500 text-white font-semibold rounded-md shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            className="py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

Page2.propTypes = {
  formData: PropTypes.shape({
    courses: PropTypes.string.isRequired,
    schedule: PropTypes.string.isRequired,
    objectives: PropTypes.string.isRequired,
  }).isRequired,
  handleNextPage: PropTypes.func.isRequired,
  handlePrevPage: PropTypes.func.isRequired,
  handleFormDataChange: PropTypes.func.isRequired,
};

export default Page2;