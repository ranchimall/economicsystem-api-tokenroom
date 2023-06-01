const { google } = require('googleapis');
const privatekey = require('./access_token.json');
const sheet_data = require('./sheet_data.json');

class EconomicSystem {
  constructor() {
    this.productionCost = 0;
    this.productionValuation = 0;
    this.consumptionNumber = 0;
    this.consumptionCost = 0;
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
        spreadsheetId: sheet_data.revenue_spreadsheetId,
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

  async fetchConsumptionNumber(){
    const auth = new google.auth.JWT(
      privatekey.client_email,
      null,
      privatekey.private_key,
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    const sheets = google.sheets({ version: 'v4', auth });

    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: sheet_data.booking_spreadsheetId,
        range: sheet_data.Booking_range, // Assuming consumption data is in column B, starting from row 7
        valueRenderOption: 'UNFORMATTED_VALUE' // Fetch the formula values instead of the displayed values
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
        this.consumptionNumber = sum
      }
    } catch (error) {
      console.error('Error fetching consumption data:', error);
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
        spreadsheetId: sheet_data.revenue_spreadsheetId,
        range: sheet_data.TR_Consumption_range, // Assuming consumption data is in column B, starting from row 7
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
    this.consumptionValuation = this.consumptionNumber * sheet_data.TR_Consumption_Valuation_Price_USD;
    return this.consumptionValuation;
  }

  calculateProductionValuation() {
    this.productionValuation = this.productionCost;
    return this.productionValuation;
  }
 
  calculateSystemValuation() {
    return Math.max(this.productionValuation, this.consumptionValuation);
  }
}

// Example usage
async function fetchDataFromGoogleSheet() {
  const tokenRoom_EconomicSystem = new EconomicSystem();
  
  await tokenRoom_EconomicSystem.fetchProductionData();
  await tokenRoom_EconomicSystem.fetchConsumptionData();
  await tokenRoom_EconomicSystem.fetchConsumptionNumber();

  console.log('Total production cost for RanchiMall:', tokenRoom_EconomicSystem.productionCost);
  console.log('Total consumption:', tokenRoom_EconomicSystem.consumptionNumber);
  console.log('Total amount in consumption:', tokenRoom_EconomicSystem.consumptionCost);
  console.log('Total production valuation:', tokenRoom_EconomicSystem.calculateProductionValuation());
  console.log('Total consumption valuation:', tokenRoom_EconomicSystem.calculateConsumptionValuation());
  console.log('System valuation:', tokenRoom_EconomicSystem.calculateSystemValuation());
}

fetchDataFromGoogleSheet();