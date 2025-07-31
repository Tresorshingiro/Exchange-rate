import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import CurrencyConverter from '../components/CurrencyConverter';
import ExchangeRateChart from '../components/ExchangeRateChart';
import ConversionHistory from '../components/ConversionHistory';
import UserStats from '../components/UserStats';

const Dashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('converter');
  const [exchangeRates, setExchangeRates] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  const fetchExchangeRates = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/exchange/rates?base=${user?.preferredCurrency || 'USD'}`);
      setExchangeRates(response.data);
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="container mt-4">
        {/* Welcome Section */}
        <div className="row mb-4">
          <div className="col">
            <div className="card bg-primary text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h2 className="mb-1">
                      <i className="fas fa-user-circle me-2"></i>
                      Welcome back, {user?.firstName}!
                    </h2>
                    <p className="mb-2">
                      <i className="fas fa-coins me-2"></i>
                      Your preferred currency: <strong>{user?.preferredCurrency}</strong>
                    </p>
                    {exchangeRates && (
                      <small className="opacity-75">
                        <i className="fas fa-clock me-1"></i>
                        Last updated: {new Date(exchangeRates.last_updated).toLocaleString()}
                      </small>
                    )}
                  </div>
                  <div className="text-end">
                    <div className="badge bg-light text-primary fs-6 px-3 py-2">
                      <i className="fas fa-globe me-1"></i>
                      50+ Currencies
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'converter' ? 'active' : ''}`}
              onClick={() => setActiveTab('converter')}
            >
              <i className="fas fa-exchange-alt me-2"></i>
              Currency Converter
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'rates' ? 'active' : ''}`}
              onClick={() => setActiveTab('rates')}
            >
              <i className="fas fa-chart-line me-2"></i>
              Exchange Rates
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              <i className="fas fa-history me-2"></i>
              History
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'stats' ? 'active' : ''}`}
              onClick={() => setActiveTab('stats')}
            >
              <i className="fas fa-chart-bar me-2"></i>
              Statistics
            </button>
          </li>
        </ul>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'converter' && (
            <div className="tab-pane fade show active">
              <CurrencyConverter exchangeRates={exchangeRates} />
            </div>
          )}
          
          {activeTab === 'rates' && (
            <div className="tab-pane fade show active">
              <ExchangeRateChart exchangeRates={exchangeRates} />
            </div>
          )}
          
          {activeTab === 'history' && (
            <div className="tab-pane fade show active">
              <ConversionHistory />
            </div>
          )}
          
          {activeTab === 'stats' && (
            <div className="tab-pane fade show active">
              <UserStats />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
