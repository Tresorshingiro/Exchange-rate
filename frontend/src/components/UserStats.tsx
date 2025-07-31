import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface Stats {
  totalConversions: number;
  mostUsedFromCurrency: string;
  mostUsedToCurrency: string;
  totalAmountConverted: number;
  recentActivity: any[];
}

const UserStats: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token, user } = useAuth();

  // Use environment variable for API URL, fallback to localhost for development
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error: any) {
      setError('Failed to fetch statistics');
      console.error('Stats fetch error:', error);
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

  if (!stats) {
    return (
      <div className="text-center py-4">
        <p>No statistics available</p>
      </div>
    );
  }

  return (
    <div className="user-stats">
      {/* Overview Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card bg-primary text-white h-100">
            <div className="card-body text-center">
              <i className="fas fa-exchange-alt fa-3x mb-3"></i>
              <h2 className="fw-bold">{stats.totalConversions}</h2>
              <p className="mb-0">Total Conversions</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-success text-white h-100">
            <div className="card-body text-center">
              <i className="fas fa-coins fa-3x mb-3"></i>
              <h2 className="fw-bold">{stats.totalAmountConverted.toFixed(2)}</h2>
              <p className="mb-0">Total Amount Converted</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-info text-white h-100">
            <div className="card-body text-center">
              <i className="fas fa-arrow-up fa-3x mb-3"></i>
              <h2 className="fw-bold">{stats.mostUsedFromCurrency || 'N/A'}</h2>
              <p className="mb-0">Most Used Source</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-warning text-white h-100">
            <div className="card-body text-center">
              <i className="fas fa-arrow-down fa-3x mb-3"></i>
              <h2 className="fw-bold">{stats.mostUsedToCurrency || 'N/A'}</h2>
              <p className="mb-0">Most Used Target</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="row">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-clock me-2"></i>
                Recent Activity
              </h5>
            </div>
            <div className="card-body">
              {stats.recentActivity.length === 0 ? (
                <div className="text-center py-4">
                  <i className="fas fa-clock fa-3x text-muted mb-3"></i>
                  <h5>No recent activity</h5>
                  <p className="text-muted">Start converting currencies to see activity here.</p>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {stats.recentActivity.map((activity, index) => (
                    <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">
                          {activity.amount} {activity.fromCurrency} → {activity.convertedAmount.toFixed(4)} {activity.toCurrency}
                        </h6>
                        <small className="text-muted">
                          Rate: {activity.rate.toFixed(6)} • {new Date(activity.date).toLocaleDateString()}
                        </small>
                      </div>
                      <span className="badge bg-primary rounded-pill">
                        {activity.fromCurrency}/{activity.toCurrency}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-user me-2"></i>
                Profile Summary
              </h5>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" 
                     style={{ width: '50px', height: '50px' }}>
                  <span className="text-white fw-bold">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </span>
                </div>
                <div>
                  <h6 className="mb-0">{user?.firstName} {user?.lastName}</h6>
                  <small className="text-muted">{user?.email}</small>
                </div>
              </div>
              
              <hr />
              
              <div className="mb-2">
                <strong>Preferred Currency:</strong>
                <span className="ms-2 badge bg-secondary">{user?.preferredCurrency}</span>
              </div>
              
              <div className="mb-2">
                <strong>Member Since:</strong>
                <div className="text-muted small">
                  {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStats;
