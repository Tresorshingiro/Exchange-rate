import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Landing: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">
                <i className="fas fa-globe-americas me-3"></i>
                Global Currency Exchange
              </h1>
              <p className="lead mb-4">
                Access real-time exchange rates for over 50 world currencies. Convert instantly, 
                track your history, and stay updated with the latest market trends in our 
                comprehensive currency exchange platform.
              </p>
              {user ? (
                <Link to="/dashboard" className="btn btn-light btn-lg">
                  Go to Dashboard
                </Link>
              ) : (
                <div>
                  <Link to="/register" className="btn btn-light btn-lg me-3">
                    Get Started
                  </Link>
                  <Link to="/login" className="btn btn-outline-light btn-lg">
                    Login
                  </Link>
                </div>
              )}
            </div>
            <div className="col-lg-6">
              <div className="text-center">
                <i className="fas fa-chart-line" style={{ fontSize: '8rem', opacity: 0.8 }}></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-5">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col">
              <h2 className="fw-bold">Why Choose Our Platform?</h2>
              <p className="text-muted">Experience the best in currency exchange services</p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <i className="fas fa-clock text-primary mb-3" style={{ fontSize: '3rem' }}></i>
                  <h5 className="card-title">Real-Time Rates</h5>
                  <p className="card-text">
                    Get the most up-to-date exchange rates powered by reliable financial data sources.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <i className="fas fa-history text-primary mb-3" style={{ fontSize: '3rem' }}></i>
                  <h5 className="card-title">Conversion History</h5>
                  <p className="card-text">
                    Track all your currency conversions with detailed history and analytics.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <i className="fas fa-chart-bar text-primary mb-3" style={{ fontSize: '3rem' }}></i>
                  <h5 className="card-title">Analytics Dashboard</h5>
                  <p className="card-text">
                    Visualize exchange rate trends and your conversion patterns with interactive charts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section bg-light py-5">
        <div className="container text-center">
          <h3 className="fw-bold mb-3">Ready to Start Converting?</h3>
          <p className="text-muted mb-4">
            Join thousands of users who trust our platform for their currency exchange needs.
          </p>
          {!user && (
            <Link to="/register" className="btn btn-primary btn-lg">
              Create Free Account
            </Link>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col">
              <h2 className="fw-bold">Why Choose Our Platform?</h2>
              <p className="text-muted">Discover the features that make currency exchange simple and reliable</p>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm feature-card">
                <div className="card-body text-center p-4">
                  <div className="feature-icon mb-3">
                    <i className="fas fa-globe fa-3x text-primary"></i>
                  </div>
                  <h5 className="card-title fw-bold">50+ Currencies</h5>
                  <p className="card-text text-muted">
                    Support for major world currencies including USD, EUR, GBP, JPY, CNY, INR, and many more.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm feature-card">
                <div className="card-body text-center p-4">
                  <div className="feature-icon mb-3">
                    <i className="fas fa-bolt fa-3x text-primary"></i>
                  </div>
                  <h5 className="card-title fw-bold">Real-Time Rates</h5>
                  <p className="card-text text-muted">
                    Get live exchange rates updated every minute from trusted financial data sources.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm feature-card">
                <div className="card-body text-center p-4">
                  <div className="feature-icon mb-3">
                    <i className="fas fa-chart-line fa-3x text-primary"></i>
                  </div>
                  <h5 className="card-title fw-bold">Smart Analytics</h5>
                  <p className="card-text text-muted">
                    Track your conversion history and analyze trends with detailed statistics and insights.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
