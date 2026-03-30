import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container-fluid py-5">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card shadow border-danger">
                <div className="card-body text-center">
                  <i className="bi bi-exclamation-triangle display-4 text-danger mb-3"></i>
                  <h5 className="card-title text-danger">Something went wrong</h5>
                  <p className="card-text text-muted mb-3">{this.state.error?.message}</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      this.setState({ hasError: false, error: null });
                      window.location.reload();
                    }}
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i>Reload Page
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
