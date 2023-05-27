const { google } = require('googleapis');
const privatekey = require('./access_token.json');
const sheet_data = require('./sheet_data.json');

class RanchiMallData {
  constructor() {
    this.productionCost = 0;
    this.consumptionCost = 0;
    this.productionValuation = 0;
    this.consumptionValuation = 0;
    this.spreadsheetId = sheet_data.spreadsheetId;
  }

  async fetchProductionData() {
    const auth = new google.auth.JWT(
      privatekey.client_email,
      null,
      privatekey.private_key,
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    const sheets = google.sheets({ version: 'v4', auth });

    try {

      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: sheet_data.TR_Expenses_range, // Assuming consumption data is in column B, starting from row 7
        valueRenderOption: 'FORMULA' // Fetch the formula values instead of the displayed values
      });
      
      const consumptionData = response.data.values;
      if (consumptionData) {
        let sum = 0;
        for (const row of consumptionData) {
          const value = parseFloat(row[0]);
          if (!isNaN(value)) {
            sum += value;
          }
        }
        this.productionCost = sum;
      }
    } catch (error) {
      console.error('Error fetching production data:', error);
    }
  }

  async fetchConsumptionData() {
    const auth = new google.auth.JWT(
      privatekey.client_email,
      null,
      privatekey.private_key,
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    const sheets = google.sheets({ version: 'v4', auth });

    try {

      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: sheet_data.TR_Expenses_range, // Assuming consumption data is in column B, starting from row 7
        valueRenderOption: 'FORMULA' // Fetch the formula values instead of the displayed values
      });
      
      const consumptionData = response.data.values;
      if (consumptionData) {
        let sum = 0;
        for (const row of consumptionData) {
          const value = parseFloat(row[0]);
          if (!isNaN(value)) {
            sum += value;
          }
        }
        this.consumptionCost = sum
      }
    } catch (error) {
      console.error('Error fetching consumption data:', error);
    }
  }

  calculateConsumptionValuation() {
    this.consumptionValuation = this.consumptionCost * 0.8;
    return this.consumptionValuation;
  }

  calculateProductionValuation() {
    this.productionValuation = this.productionCost * 1.2;
    return this.productionValuation;
  }

  calculateSystemValuation() {
    return Math.max(this.productionValuation, this.consumptionValuation);
  }
}

// Example usage
async function fetchDataFromGoogleSheet() {
  const ranchiMallData = new RanchiMallData();
  
  await ranchiMallData.fetchProductionData();
  await ranchiMallData.fetchConsumptionData();

  console.log('Total production cost for RanchiMall:', ranchiMallData.productionCost);
  console.log('Total consumption cost by users:', ranchiMallData.consumptionCost);
  console.log('Total pxpense valuation of RanchiMall:', ranchiMallData.calculateProductionValuation());
  console.log('Total consumption valuation of users:', ranchiMallData.calculateConsumptionValuation());
  console.log('System valuation:', ranchiMallData.calculateSystemValuation());
}

fetchDataFromGoogleSheet();