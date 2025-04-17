import PropTypes from 'prop-types';
import questionMap from '../assets/QuestionData.js/page3Questions';

function Page3({ userType, formData, handleNextPage, handlePrevPage, handleFormDataChange }) {
  const questions = questionMap[userType] || [];

  const handleChange = (e,label) => {
    const { name, type, value, checked } = e.target;
    handleFormDataChange({ [name]: type === 'checkbox' ? {checked , label} : {value,label }});
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Part 3: Work Context
      </h2>

      <div className="space-y-6">
        {questions.map((q) => (
          <div key={q.id}>
            <label htmlFor={q.id} className="block text-sm font-medium text-gray-700">
              {q.label}
            </label>

            {q.type === "select" ? (
              <select
                id={q.id}
                name={q.id}
                value={formData[q.id]?.value || ""}
                onChange={(e) => handleChange(e, q.label)} 
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {q.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : q.type === "checkbox" ? (
              <input
                type="checkbox"
                id={q.id}
                name={q.id}
                checked={formData[q.id]?.value || false}
                onChange={(e) => handleChange(e, q.label)} 
                className="mt-1"
              />
            ) : (
              <input
                type="text"
                id={q.id}
                name={q.id}
                value={formData[q.id]?.value || ""}
                onChange={(e) => handleChange(e, q.label)} 
                placeholder={q.placeholder || ""}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            )}
          </div>
        ))}

        <div className="flex justify-between mt-6">
          <button
            onClick={handlePrevPage}
            className="py-2 px-4 bg-gray-500 text-white font-semibold rounded-md shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

Page3.propTypes = {
  userType: PropTypes.string,
  formData: PropTypes.object.isRequired,
  handleNextPage: PropTypes.func.isRequired,
  handlePrevPage: PropTypes.func.isRequired,
  handleFormDataChange: PropTypes.func.isRequired,
};

export default Page3;