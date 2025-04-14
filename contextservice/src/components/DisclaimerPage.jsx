import PropTypes from "prop-types";
import { useState } from "react";

/**
 * DisclaimerPage Component
 * Displays a disclaimer with user consent checkpoints before proceeding.
 */
function DisclaimerPage({ handleAccept }) {
  const [checkpoints, setCheckpoints] = useState({
    dataUsage: false,
    dataSecurity: false,
    userConsent: false,
  });

  const handleCheckboxChange = (checkpoint) => {
    setCheckpoints((prev) => ({ ...prev, [checkpoint]: !prev[checkpoint] }));
  };

  const allChecked = Object.values(checkpoints).every(Boolean);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl max-w-2xl mx-auto mt-10">
      <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">
        Disclaimer
      </h1>
      <p className="text-gray-600 mb-6 text-sm leading-relaxed text-justify">
        Before using this application, please read the following carefully. By agreeing,
        you consent to our practices concerning data usage and privacy. Your information is
        collected only to improve your experience and will never be shared externally. We ensure
        your data is encrypted and stored securely in accordance with standard data protection regulations.
      </p>

      <div className="space-y-4 mb-6">
        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={checkpoints.dataUsage}
            onChange={() => handleCheckboxChange("dataUsage")}
            className="mt-1 h-5 w-5 text-custom-blue rounded focus:ring-custom-blue"
          />
          <span className="text-gray-700 text-sm">
            I understand that my data is used to generate personalized responses.
          </span>
        </label>

        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={checkpoints.dataSecurity}
            onChange={() => handleCheckboxChange("dataSecurity")}
            className="mt-1 h-5 w-5 text-custom-blue rounded focus:ring-custom-blue"
          />
          <span className="text-gray-700 text-sm">
            I acknowledge that my data will be stored securely and not shared with third parties.
          </span>
        </label>

        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={checkpoints.userConsent}
            onChange={() => handleCheckboxChange("userConsent")}
            className="mt-1 h-5 w-5 text-custom-blue rounded focus:ring-custom-blue"
          />
          <span className="text-gray-700 text-sm">
            I consent to the application&apos;s data usage policies.
          </span>
        </label>
      </div>

      <button
        onClick={handleAccept}
        disabled={!allChecked}
        className={`w-full py-2.5 text-white font-semibold rounded-xl transition-all ${
          allChecked
            ? "bg-custom-blue hover:bg-blue-600"
            : "bg-gray-300 cursor-not-allowed"
        }`}
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