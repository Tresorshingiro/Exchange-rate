import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface CurrencyConverterProps {
  exchangeRates: any;
}

const CurrencyConverter: React.FC<CurrencyConverterProps> = ({ exchangeRates }) => {
  const [amount, setAmount] = useState<string>('1');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  // Use environment variable for API URL, fallback to localhost for development
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

  const currencies = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'CHF', name: 'Swiss Franc' },
    { code: 'CNY', name: 'Chinese Yuan' },
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'KRW', name: 'South Korean Won' },
    { code: 'BRL', name: 'Brazilian Real' },
    { code: 'MXN', name: 'Mexican Peso' },
    { code: 'RUB', name: 'Russian Ruble' },
    { code: 'ZAR', name: 'South African Rand' },
    { code: 'SEK', name: 'Swedish Krona' },
    { code: 'NOK', name: 'Norwegian Krone' },
    { code: 'DKK', name: 'Danish Krone' },
    { code: 'PLN', name: 'Polish Zloty' },
    { code: 'TRY', name: 'Turkish Lira' },
    { code: 'SGD', name: 'Singapore Dollar' },
    { code: 'HKD', name: 'Hong Kong Dollar' },
    { code: 'NZD', name: 'New Zealand Dollar' },
    { code: 'ILS', name: 'Israeli Shekel' },
    { code: 'AED', name: 'UAE Dirham' },
    { code: 'SAR', name: 'Saudi Arabian Riyal' },
    { code: 'THB', name: 'Thai Baht' },
    { code: 'PHP', name: 'Philippine Peso' },
    { code: 'MYR', name: 'Malaysian Ringgit' },
    { code: 'IDR', name: 'Indonesian Rupiah' },
    { code: 'VND', name: 'Vietnamese Dong' },
    { code: 'TWD', name: 'Taiwan Dollar' },
    { code: 'CZK', name: 'Czech Koruna' },
    { code: 'HUF', name: 'Hungarian Forint' },
    { code: 'RON', name: 'Romanian Leu' },
    { code: 'BGN', name: 'Bulgarian Lev' },
    { code: 'HRK', name: 'Croatian Kuna' },
    { code: 'ISK', name: 'Icelandic Krona' },
    { code: 'EGP', name: 'Egyptian Pound' },
    { code: 'NGN', name: 'Nigerian Naira' },
    { code: 'KES', name: 'Kenyan Shilling' },
    { code: 'GHS', name: 'Ghanaian Cedi' },
    { code: 'PKR', name: 'Pakistani Rupee' },
    { code: 'BDT', name: 'Bangladeshi Taka' },
    { code: 'LKR', name: 'Sri Lankan Rupee' },
    { code: 'NPR', name: 'Nepalese Rupee' },
    { code: 'CLP', name: 'Chilean Peso' },
    { code: 'ARS', name: 'Argentine Peso' },
    { code: 'COP', name: 'Colombian Peso' },
    { code: 'PEN', name: 'Peruvian Sol' },
    { code: 'UYU', name: 'Uruguayan Peso' }
  ];

  const handleConvert = async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/exchange/convert?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`
      );
      
      if (response.data.success) {
        setResult(response.data);
        
        // Save conversion to history
        if (token) {
          await axios.post(`${API_BASE_URL}/exchange/save-conversion`, {
            fromCurrency,
            toCurrency,
            amount: parseFloat(amount),
            convertedAmount: response.data.converted_amount,
            rate: response.data.conversion_rate
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
      }
    } catch (error) {
      console.error('Conversion error:', error);
    } finally {
      setLoading(false);
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
  };

  return (
    <div className="currency-converter">
      <div className="row">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-exchange-alt me-2"></i>
                Currency Converter
              </h5>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-3">
                  <label className="form-label">Amount</label>
                  <input
                    type="number"
                    className="form-control"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">From</label>
                  <select
                    className="form-select"
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                  >
                    {currencies.map(currency => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-1 d-flex align-items-end">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={swapCurrencies}
                  >
                    <i className="fas fa-exchange-alt"></i>
                  </button>
                </div>
                <div className="col-md-4">
                  <label className="form-label">To</label>
                  <select
                    className="form-select"
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                  >
                    {currencies.map(currency => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                className="btn btn-primary btn-lg"
                onClick={handleConvert}
                disabled={loading || !amount}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Converting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-calculator me-2"></i>
                    Convert
                  </>
                )}
              </button>

              {result && (
                <div className="mt-4 p-4 bg-light rounded shadow-sm fade-in-up">
                  <div className="text-center">
                    <h3 className="text-primary mb-3">
                      <i className="fas fa-arrow-right me-2"></i>
                      Conversion Result
                    </h3>
                    <div className="row">
                      <div className="col-md-5 text-end">
                        <h4 className="mb-0">{amount} {result.from}</h4>
                      </div>
                      <div className="col-md-2 text-center">
                        <i className="fas fa-equals text-primary"></i>
                      </div>
                      <div className="col-md-5 text-start">
                        <h4 className="mb-0 text-primary">{result.converted_amount.toFixed(4)} {result.to}</h4>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-muted mb-1">
                        <strong>Exchange Rate:</strong> 1 {result.from} = {result.conversion_rate.toFixed(6)} {result.to}
                      </p>
                      <small className="text-muted">
                        <i className="fas fa-clock me-1"></i>
                        Last updated: {new Date(result.last_updated).toLocaleString()}
                      </small>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">Quick Rates</h6>
            </div>
            <div className="card-body">
              {exchangeRates && exchangeRates.rates && (
                <div className="quick-rates">
                  {Object.entries(exchangeRates.rates)
                    .slice(0, 8)
                    .map(([currency, rate]: [string, any]) => (
                      <div key={currency} className="d-flex justify-content-between border-bottom py-2">
                        <span>{currency}</span>
                        <span>{Number(rate).toFixed(4)}</span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
