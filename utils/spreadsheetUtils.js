const { google } = require('googleapis');
const privatekey = require('../config/access_token.json');

async function fetchSheetValues(spreadsheetId, range, valueRenderOption) {
  const auth = new google.auth.JWT(
    privatekey.client_email,
    null,
    privatekey.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
  );

  const sheets = google.sheets({ version: 'v4', auth });

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
      valueRenderOption,
    });

    return response.data.values;
  } catch (error) {
    console.error('Error fetching sheet values:', error);
    return null;
  }
}

module.exports = {
  fetchSheetValues,
};
