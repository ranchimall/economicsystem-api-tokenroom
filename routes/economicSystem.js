const express = require('express');
const router = express.Router();
const EconomicSystem = require('../utils/EconomicSystem');
const { fetchSheetValues } = require('../utils/spreadsheetUtils');
const sheet_data = require('../config/sheet_data.json');

router.get('/data', async (req, res) => {
  try {
    const tokenRoom_EconomicSystem = new EconomicSystem();

    // Fetch production data
    await tokenRoom_EconomicSystem.fetchProductionData();

    // Fetch consumption data
    await tokenRoom_EconomicSystem.fetchConsumptionData();

    // // Fetch consumption number
    await tokenRoom_EconomicSystem.fetchConsumptionNumber();

    const productionCost = tokenRoom_EconomicSystem.productionCost;
    const consumptionNumber = tokenRoom_EconomicSystem.consumptionNumber;
    const consumptionCost = tokenRoom_EconomicSystem.consumptionCost;
    const productionValuation = tokenRoom_EconomicSystem.calculateProductionValuation();
    const consumptionValuation = tokenRoom_EconomicSystem.calculateConsumptionValuation();
    //const systemValuation = tokenRoom_EconomicSystem.calculateSystemValuation();

    res.json({
      productionCost,
      consumptionNumber,
      consumptionCost,
      productionValuation,
      consumptionValuation,
      //systemValuation,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/sheet-values', async (req, res) => {
  try {
    const spreadsheetId = sheet_data.spreadsheetId;
    const range = sheet_data.sheet_range;
    const valueRenderOption = 'FORMULA';

    const sheetValues = await fetchSheetValues(spreadsheetId, range, valueRenderOption);

    res.json({ sheetValues });
  } catch (error) {
    console.error('Error fetching sheet values:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
