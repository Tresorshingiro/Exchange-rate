const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// @route   GET /api/exchange/rates
// @desc    Get current exchange rates
// @access  Public
router.get('/rates', async (req, res) => {
  try {
    const { base = 'USD' } = req.query;
    const response = await axios.get(`https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_API_KEY}/latest/${base}`);
    
    if (response.data.result === 'success') {
      res.json({
        success: true,
        base_code: response.data.base_code,
        rates: response.data.conversion_rates,
        last_updated: response.data.time_last_update_utc
      });
    } else {
      res.status(400).json({ success: false, message: 'Failed to fetch exchange rates' });
    }
  } catch (error) {
    console.error('Exchange rates error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching exchange rates' });
  }
});

// @route   GET /api/exchange/convert
// @desc    Convert currency
// @access  Public
router.get('/convert', async (req, res) => {
  try {
    const { from, to, amount } = req.query;
    
    if (!from || !to || !amount) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide from, to, and amount parameters' 
      });
    }

    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_API_KEY}/pair/${from}/${to}/${amount}`
    );
    
    if (response.data.result === 'success') {
      res.json({
        success: true,
        from: response.data.base_code,
        to: response.data.target_code,
        amount: parseFloat(amount),
        converted_amount: response.data.conversion_result,
        conversion_rate: response.data.conversion_rate,
        last_updated: response.data.time_last_update_utc
      });
    } else {
      res.status(400).json({ success: false, message: 'Failed to convert currency' });
    }
  } catch (error) {
    console.error('Currency conversion error:', error);
    res.status(500).json({ success: false, message: 'Server error during currency conversion' });
  }
});

// @route   POST /api/exchange/save-conversion
// @desc    Save conversion to user history
// @access  Private
router.post('/save-conversion', auth, async (req, res) => {
  try {
    const { fromCurrency, toCurrency, amount, convertedAmount, rate } = req.body;
    
    const user = await User.findById(req.user.userId);
    
    user.exchangeHistory.push({
      fromCurrency,
      toCurrency,
      amount,
      convertedAmount,
      rate,
      date: new Date()
    });
    
    await user.save();
    
    res.json({ success: true, message: 'Conversion saved to history' });
  } catch (error) {
    console.error('Save conversion error:', error);
    res.status(500).json({ success: false, message: 'Server error saving conversion' });
  }
});

// @route   GET /api/exchange/history
// @desc    Get user's conversion history
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const history = user.exchangeHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    res.json({ success: true, history });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching history' });
  }
});

// @route   GET /api/exchange/supported-currencies
// @desc    Get list of supported currencies
// @access  Public
router.get('/supported-currencies', async (req, res) => {
  try {
    const response = await axios.get(`https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_API_KEY}/codes`);
    
    if (response.data.result === 'success') {
      res.json({
        success: true,
        currencies: response.data.supported_codes
      });
    } else {
      res.status(400).json({ success: false, message: 'Failed to fetch supported currencies' });
    }
  } catch (error) {
    console.error('Supported currencies error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching supported currencies' });
  }
});

module.exports = router;
