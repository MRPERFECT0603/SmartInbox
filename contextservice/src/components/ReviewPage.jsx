import PropTypes from "prop-types";

/**
 * Review Data Component
 * Renders the final page of a multi-step form for reviewing all the data the user has submitted.
 */
function ReviewPage({ formData, handlePrevPage, handleSubmit }) {
  console.log(formData);
  return (
    <div className="h-screen flex flex-col bg-gray-100 max-h-[calc(100vh-200px)]">
      {/* Header Section */}
      <header className="bg-white shadow-lg rounded p-4 no-scrollbar">
        <h2 className="text-2xl font-semibold text-gray-800">
          Review Your Data
        </h2>
      </header>

      {/* Scrollable Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6 mb-6">
          {Object.entries(formData).map(([key, value]) => (
            <div key={key} className="">
              <p className="text-base text-gray-800 leading-relaxed">
                <strong className="text-gray-600">
                  {value.label ||
                    key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                </strong>
              </p>
              <p className="text-gray-900">{value.value || value}</p>
            </div>
          ))}
        </div>
      </main>
      <footer className="bg-white shadow-inner p-4 flex justify-between">
        <button
          onClick={handlePrevPage}
          className="bg-gray-500 text-white rounded-md px-6 py-2 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          Previous
        </button>
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white rounded-md px-6 py-2 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600"
        >
          Submit
        </button>
      </footer>
    </div>
  );
}

ReviewPage.propTypes = {
  formData: PropTypes.object.isRequired,
  handlePrevPage: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default ReviewPage;
