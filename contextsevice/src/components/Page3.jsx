import PropTypes from 'prop-types';

function Page3({ formData, handleNextPage, handlePrevPage, handleFormDataChange }) {
  const handleChange = (e) => {
    handleFormDataChange({ [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Page 3: Class Policies and FAQs</h2>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="attendance" className="block text-sm font-medium text-gray-700">Attendance Policy</label>
          <textarea
            id="attendance"
            name="attendance"
            value={formData.attendance}
            onChange={handleChange}
            rows="4"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter the attendance policy"
          />
        </div>

        <div>
          <label htmlFor="lateAssignments" className="block text-sm font-medium text-gray-700">Late Assignment Policy</label>
          <textarea
            id="lateAssignments"
            name="lateAssignments"
            value={formData.lateAssignments}
            onChange={handleChange}
            rows="4"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter the late assignment policy"
          />
        </div>

        <div>
          <label htmlFor="faqs" className="block text-sm font-medium text-gray-700">FAQs</label>
          <textarea
            id="faqs"
            name="faqs"
            value={formData.faqs}
            onChange={handleChange}
            rows="4"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter frequently asked questions"
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

Page3.propTypes = {
  formData: PropTypes.shape({
    attendance: PropTypes.string.isRequired,
    lateAssignments: PropTypes.string.isRequired,
    faqs: PropTypes.string.isRequired,
  }).isRequired,
  handleNextPage: PropTypes.func.isRequired,
  handlePrevPage: PropTypes.func.isRequired,
  handleFormDataChange: PropTypes.func.isRequired,
};

export default Page3;