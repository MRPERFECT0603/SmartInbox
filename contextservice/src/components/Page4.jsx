import PropTypes from 'prop-types';



/**
 * Page4 Component
 * Renders the fourth page of a multi-step form for collecting Grading and Imposrtant Dates
 */
function Page4({ formData, handlePrevPage, handleFormDataChange, handleNextPage }) {
  const handleChange = (e) => {
    handleFormDataChange({ [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Page 4: Grading and Important Dates</h2>
      <div className="space-y-6">
        {/* Grading Breakdown Input Field */}
        <div>
          <label htmlFor="grading" className="block text-sm font-medium text-gray-700">Grading Breakdown</label>
          <textarea
            id="grading"
            name="grading"
            value={formData.grading}
            onChange={handleChange}
            rows="4"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Enter grading breakdown"
          />
        </div>
        {/* Impportant Dates Input Field */}
        <div>
          <label htmlFor="importantDates" className="block text-sm font-medium text-gray-700">Important Dates</label>
          <textarea
            id="importantDates"
            name="importantDates"
            value={formData.importantDates}
            onChange={handleChange}
            rows="4"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Enter important dates"
          />
        </div>
        <div className="flex justify-between mt-6">
          <button
            onClick={handlePrevPage}
            className="py-2 px-4 bg-gray-500 text-white font-semibold rounded-md shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

Page4.propTypes = {
  formData: PropTypes.shape({
    grading: PropTypes.string.isRequired,
    importantDates: PropTypes.string.isRequired,
  }).isRequired,
  handlePrevPage: PropTypes.func.isRequired,
  handleFormDataChange: PropTypes.func.isRequired,
  handleNextPage: PropTypes.func.isRequired,
};

export default Page4;