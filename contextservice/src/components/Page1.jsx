import PropTypes from "prop-types";

/**
 * Page1 Component
 * Renders the first page of a multi-step form for collecting personal and professional identity.
 */
function Page1({ formData, handleNextPage, handleFormDataChange }) {
  const handleChange = (e) => {
    handleFormDataChange({ [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Part 1: User Identity & Background
      </h2>
      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700"
          >
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
            placeholder="Enter your full name"
          />
        </div>

         {/* age */}
         <div>
          <label
            htmlFor="age"
            className="block text-sm font-medium text-gray-700"
          >
            Age
          </label>
          <input
            type="text"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
            placeholder="Enter Your Age"
          />
        </div>

        {/* Job Title */}
        <div>
          <label
            htmlFor="preferredName"
            className="block text-sm font-medium text-gray-700"
          >
            What is your current role or job title?
          </label>
          <input
            type="text"
            id="jobTitle"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
            placeholder="Your role or designation"
          />
        </div>


         {/* Communication Audience */}
         <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {" "}
            Which organization, institute, or company are you currently
            associated with?
          </label>
          <input
            type="text"
            id="organization"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
            placeholder="Enter the name of your organization"
          />
        </div>


        {/* Self_Bio */}
        <div>
          <label
            htmlFor="responsibilities"
            className="block text-sm font-medium text-gray-700"
          >
          Please write a short bio you’d typically use when introducing yourself.
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
            placeholder="Describe yourself in 1-2 sentences"
          />
        </div>
       
        {/* UserType */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Choose Your User Type.
          </label>
          <select
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
          >
            <option value="">-- Select One --</option>
            <option value="teacher">Teacher/Professor/Eductaor</option>
            <option value="student">Student</option>
            <option value="corporate">Corporate Professional</option>
            <option value="sales">Sales Professional</option>
            <option value="recruiter">Recuriter/HR Professional</option>
            <option value="creator">Creator/Influencer</option>
          </select>
        </div>

        {/* Next Button */}
        <div className="mt-6">
          <button
            onClick={handleNextPage}
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-800 focus:ring-2 focus:ring-blue-600 focus:outline-none"
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
    fullName: PropTypes.string.isRequired,
    age: PropTypes.string.isRequired,
    jobTitle: PropTypes.string.isRequired,
    organization: PropTypes.string.isRequired,
    bio: PropTypes.string.isRequired,
    userType: PropTypes.string.isRequired,
  }).isRequired,
  handleNextPage: PropTypes.func.isRequired,
  handleFormDataChange: PropTypes.func.isRequired,
};

export default Page1;
