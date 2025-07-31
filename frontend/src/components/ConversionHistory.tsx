import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface Conversion {
  _id: string;
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  convertedAmount: number;
  rate: number;
  date: string;
}

const ConversionHistory: React.FC = () => {
  const [history, setHistory] = useState<Conversion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  // Use environment variable for API URL, fallback to localhost for development
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/exchange/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setHistory(response.data.history);
      }
    } catch (error: any) {
      setError('Failed to fetch conversion history');
      console.error('History fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="conversion-history">
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">
            <i className="fas fa-history me-2"></i>
            Conversion History
          </h5>
        </div>
        <div className="card-body">
          {history.length === 0 ? (
            <div className="text-center py-4">
              <i className="fas fa-history fa-3x text-muted mb-3"></i>
              <h5>No conversions yet</h5>
              <p className="text-muted">Start converting currencies to see your history here.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Amount</th>
                    <th>Converted</th>
                    <th>Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((conversion) => (
                    <tr key={conversion._id}>
                      <td>
                        {new Date(conversion.date).toLocaleDateString()} {' '}
                        {new Date(conversion.date).toLocaleTimeString()}
                      </td>
                      <td>
                        <span className="badge bg-primary">
                          {conversion.fromCurrency}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-success">
                          {conversion.toCurrency}
                        </span>
                      </td>
                      <td>
                        {conversion.amount.toLocaleString()} {conversion.fromCurrency}
                      </td>
                      <td>
                        {conversion.convertedAmount.toFixed(4)} {conversion.toCurrency}
                      </td>
                      <td>
                        {conversion.rate.toFixed(6)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {history.length > 0 && (
          <div className="card-footer text-muted">
            Total conversions: <strong>{history.length}</strong>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversionHistory;
