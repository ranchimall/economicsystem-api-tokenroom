const { google } = require('googleapis');
const sheet_data = require('../config/sheet_data.json');
const xlsx = require('xlsx');
const path = require('path');

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
    try {
      const workbook = xlsx.readFile(path.resolve(__dirname, `../data/${sheet_data.revenue_spreadsheetName}`));
      // Assuming the "TR-Expenses" sheet is the third sheet (index 2) of the workbook
      const worksheet = workbook.Sheets[sheet_data.TR_Expenses_sheet];
      const { s: startCell, e: endCell } = xlsx.utils.decode_range(sheet_data.TR_Expenses_range);

      let productionSum = 0;
      for (let row = startCell.r; row <= endCell.r; row++) {
         for (let col = startCell.c; col <= endCell.c; col++) {
          const cellAddress = xlsx.utils.encode_cell({ r: row, c: col });
          const cellValue = worksheet[cellAddress]?.v;
             if (typeof cellValue === 'number'){
               productionSum += cellValue;
             }
          }
      }

      this.productionCost = productionSum;
    } catch (error) {
      console.error('Error fetching production data:', error);
      return null;
    }
  }

  async fetchConsumptionData() {
    try {
      const workbook = xlsx.readFile(path.resolve(__dirname, `../data/${sheet_data.revenue_spreadsheetName}`));
      const worksheet = workbook.Sheets[sheet_data.TR_Consumption_sheet];
      const { s: startCell, e: endCell } = xlsx.utils.decode_range(sheet_data.TR_Consumption_range);

      let consumptionSum = 0;
      for (let row = startCell.r; row <= endCell.r; row++) {
        for (let col = startCell.c; col <= endCell.c; col++) {
          const cellAddress = xlsx.utils.encode_cell({ r: row, c: col });
          const cellValue = worksheet[cellAddress]?.v;
          if (typeof cellValue === 'number'){
            consumptionSum += cellValue;
          }
        }
      }

      this.consumptionCost = consumptionSum;
    } catch (error) {
      console.error('Error fetching conumption data:', error);
      return null;
    }

  }

  async fetchConsumptionNumber() {
    try {
      const workbook = xlsx.readFile(path.resolve(__dirname, `../data/${sheet_data.booking_spreadsheetName}`));
      // Assuming the "TR-Expenses" sheet is the third sheet (index 2) of the workbook
      const worksheet = workbook.Sheets[sheet_data.Booking_sheet];
      const { s: startCell, e: endCell } = xlsx.utils.decode_range(sheet_data.Booking_range);

      let consumptionNumber = 0;
      for (let row = startCell.r; row <= endCell.r; row++) {
        for (let col = startCell.c; col <= endCell.c; col++) {
          const cellAddress = xlsx.utils.encode_cell({ r: row, c: col });
          const cellValue = worksheet[cellAddress]?.v;
          if (typeof cellValue === 'number'){
            consumptionNumber += cellValue;
          }
        }
      }
      
      this.consumptionNumber = consumptionNumber;
    } catch (error) {
      console.error('Error fetching conumption data:', error);
      return null;
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