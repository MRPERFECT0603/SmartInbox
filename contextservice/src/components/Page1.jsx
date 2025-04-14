import PropTypes from 'prop-types';

/**
 * Page1 Component
 * Renders the first page of a multi-step form for collecting personal information.
 */
function Page1({ formData, handleNextPage, handleFormDataChange }) {
  const handleChange = (e) => {
    handleFormDataChange({ [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg ">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Page 1: Personal Information</h2>
      <div className="space-y-4">
        {/* Name Input Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Enter your name"
          />
        </div>

        {/* Age Input Field */}
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
          <input
            type="text"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Enter your age"
          />
        </div>

        {/* Occupation Input Field */}
        <div>
          <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">Occupation</label>
          <input
            type="text"
            id="occupation"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Enter your occupation"
          />
        </div>

        {/* Email Input Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Enter your email"
          />
        </div>

        {/* Phone Input Field */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="text"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Enter your Password"
          />
        </div>

        {/* Website Input Field */}
        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700">Website</label>
          <input
            type="text"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Enter your website"
          />
        </div>

        {/* Next Button */}
        <div className="mt-6">
          <button
            onClick={handleNextPage}
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

Page1.propTypes = {
  formData: PropTypes.shape({
    name: PropTypes.string.isRequired,      
    age: PropTypes.string.isRequired,        
    occupation: PropTypes.string.isRequired, 
    email: PropTypes.string.isRequired,      
    password: PropTypes.string.isRequired,      
    website: PropTypes.string.isRequired,    
  }).isRequired,
  handleNextPage: PropTypes.func.isRequired,      
  handleFormDataChange: PropTypes.func.isRequired 
};

export default Page1;