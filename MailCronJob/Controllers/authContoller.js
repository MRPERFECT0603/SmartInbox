const { authorize } = require('../services/authService');

/**
 * Controller function to handle API authorization.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const authorizeApi = async (req, res) => {
  try {
    const auth = await authorize(); // Initiates the OAuth2 flow or uses existing token.

    if (auth) {
      console.log('Authorization successful.');
      res.status(200).json({ success: true, message: 'Authorized successfully.' });
    } else {
      res.status(401).json({ success: false, message: 'Authorization failed.' });
    }
  } catch (error) {
    console.error('Error during authorization:', error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error.' });
  }
};

module.exports = { authorizeApi };