const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const { firstName, lastName, preferredCurrency } = req.body;
    
    const user = await User.findById(req.user.userId);
    
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (preferredCurrency) user.preferredCurrency = preferredCurrency;
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        preferredCurrency: user.preferredCurrency
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Server error updating profile' });
  }
});

// @route   GET /api/user/stats
// @desc    Get user exchange statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const history = user.exchangeHistory;
    
    const stats = {
      totalConversions: history.length,
      mostUsedFromCurrency: getMostUsedCurrency(history, 'fromCurrency'),
      mostUsedToCurrency: getMostUsedCurrency(history, 'toCurrency'),
      totalAmountConverted: history.reduce((sum, conversion) => sum + conversion.amount, 0),
      recentActivity: history.slice(-10).reverse()
    };
    
    res.json({ success: true, stats });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching statistics' });
  }
});

// Helper function to get most used currency
function getMostUsedCurrency(history, field) {
  const currencyCount = {};
  history.forEach(conversion => {
    const currency = conversion[field];
    currencyCount[currency] = (currencyCount[currency] || 0) + 1;
  });
  
  return Object.keys(currencyCount).reduce((a, b) => 
    currencyCount[a] > currencyCount[b] ? a : b, ''
  );
}

module.exports = router;
