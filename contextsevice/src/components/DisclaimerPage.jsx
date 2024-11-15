import PropTypes from 'prop-types';
import { useState } from 'react';

function DisclaimerPage({ handleAccept }) {
  const [accepted, setAccepted] = useState(false);

  const handleCheckboxChange = () => {
    setAccepted(!accepted);
  };

  return (
    <div className=" p-6 bg-white shadow-lg rounded-lg text-center">
      <h2 className="text-2xl font-semibold mb-4">Disclaimer</h2>
      <p className="mb-4">
        Please read the following disclaimer carefully. By proceeding, you agree to our terms 
        regarding data collection and usage in this application. Your data will be used to 
        generate a personalized assistant context.
      </p>
      <p className="mb-6">
        This information will help create tailored responses and suggestions, improving 
        your assistant’s functionality. No personal data will be shared with third parties.
      </p>
      <label className="flex items-center justify-center space-x-2">
        <input
          type="checkbox"
          checked={accepted}
          onChange={handleCheckboxChange}
          className="form-checkbox"
        />
        <span>I accept the terms and conditions.</span>
      </label>
      <button
        onClick={handleAccept}
        disabled={!accepted}
        className={`mt-6 px-4 py-2 font-semibold text-white ${
          accepted ? 'bg-custom-blue' : 'bg-gray-400 cursor-not-allowed'
        } rounded`}
      >
        Proceed
      </button>
    </div>
  );
}

DisclaimerPage.propTypes = {
  handleAccept: PropTypes.func.isRequired,
};

export default DisclaimerPage;