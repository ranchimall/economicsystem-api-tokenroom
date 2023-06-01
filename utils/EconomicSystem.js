const { google } = require('googleapis');
const privatekey = require('../config/access_token.json');
const sheet_data = require('../config/sheet_data.json');

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
        range: sheet_data.TR_Expenses_range,
        valueRenderOption: 'FORMULA'
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
        range: sheet_data.Booking_range,
        valueRenderOption: 'UNFORMATTED_VALUE'
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
        range: sheet_data.TR_Consumption_range,
        valueRenderOption: 'FORMULA'
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

module.exports = EconomicSystem;
