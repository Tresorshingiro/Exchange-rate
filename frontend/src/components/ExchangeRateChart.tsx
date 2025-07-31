import React from 'react';

interface ExchangeRateChartProps {
  exchangeRates: any;
}

const ExchangeRateChart: React.FC<ExchangeRateChartProps> = ({ exchangeRates }) => {
  const majorCurrencies = ['EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR'];

  if (!exchangeRates || !exchangeRates.rates) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <p>Loading exchange rates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="exchange-rates">
      <div className="row">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-chart-line me-2"></i>
                Exchange Rates ({exchangeRates.base_code})
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                {majorCurrencies.map(currency => {
                  const rate = exchangeRates.rates[currency];
                  if (!rate) return null;
                  
                  return (
                    <div key={currency} className="col-md-6 col-lg-4 mb-3">
                      <div className="card border-0 bg-light h-100">
                        <div className="card-body text-center">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6 className="card-title mb-0 text-primary fw-bold">{currency}</h6>
                            <i className="fas fa-coins text-warning"></i>
                          </div>
                          <h4 className="text-primary mb-2">{Number(rate).toFixed(4)}</h4>
                          <small className="text-muted">
                            1 {exchangeRates.base_code} = {Number(rate).toFixed(4)} {currency}
                          </small>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">All Currencies</h6>
            </div>
            <div className="card-body" style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {Object.entries(exchangeRates.rates)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([currency, rate]: [string, any]) => (
                  <div key={currency} className="d-flex justify-content-between border-bottom py-2">
                    <span className="fw-bold">{currency}</span>
                    <span>{Number(rate).toFixed(6)}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="row mt-4">
        <div className="col">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1">Data Source</h6>
                  <p className="text-muted mb-0">ExchangeRate-API</p>
                </div>
                <div className="text-end">
                  <h6 className="mb-1">Last Updated</h6>
                  <p className="text-muted mb-0">
                    {new Date(exchangeRates.last_updated).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExchangeRateChart;
