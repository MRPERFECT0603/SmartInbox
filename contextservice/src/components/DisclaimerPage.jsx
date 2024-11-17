import PropTypes from "prop-types";
import { useState } from "react";

/**
 * DisclaimerPage Component
 * This component displays a disclaimer message to the user, informing them 
 * about the application's data usage policies and requiring their consent 
 * before proceeding.
 *
 * Props:
 * - handleAccept: A function passed as a prop that gets called when the user accepts the terms.
 */
function DisclaimerPage({ handleAccept }) {
  const [accepted, setAccepted] = useState(false);

  const handleCheckboxChange = () => {
    setAccepted(!accepted);
  };

  return (
    <div className="p-6  bg-white shadow-lg rounded-lg text-center">
      <h2 className="text-2xl font-semibold mb-4">Disclaimer</h2>
      <p className="mb-4">
        By using this application, you consent to the collection and processing
        of your data as outlined below. The information you provide will be used
        solely to generate personalized responses and suggestions within the
        assistant, enhancing its relevance and functionality.
      </p>
      <p className="mb-6">
        Your data will be securely stored in our system and protected using
        industry-standard encryption methods to prevent unauthorized access.
        This data is accessible only by this application and will not be shared
        with any third parties. We are committed to maintaining the
        confidentiality and privacy of your information in accordance with
        applicable data protection regulations.
      </p>
      <p className="mb-6">
        Please proceed only if you agree to these terms. If you have any
        concerns about how your data will be used, feel free to contact us for
        more information.
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
        disabled={!accepted} // Disable button if terms are not accepted
        className={`mt-6 px-4 py-2 font-semibold text-white ${
          accepted ? "bg-custom-blue" : "bg-gray-400 cursor-not-allowed"
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