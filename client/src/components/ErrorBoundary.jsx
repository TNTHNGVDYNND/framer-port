import { Component } from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='min-h-screen flex items-center justify-center p-8 bg-bg-body'>
          <div className='terminal-window bg-card-bg max-w-2xl w-full'>
            <div
              className='terminal-window__header bg-neutral-900'
              style={{ borderColor: 'var(--color-neutral-800)' }}
            >
              <div className='flex items-center gap-2'>
                <div className='w-3 h-3 rounded-full bg-coral' />
                <div className='w-3 h-3 rounded-full bg-dusk' />
                <div className='w-3 h-3 rounded-full bg-lagoon' />
                <span className='ml-4 text-sm font-mono text-text-secondary'>
                  error.log
                </span>
              </div>
            </div>
            <div className='p-8 font-mono'>
              <pre className='text-coral text-lg font-bold mb-4'>
                {`[CRITICAL ERROR]
████ ████ ████ ████ ████
█  █ █  █ █    █  █ █  █
████ █  █ ████ ████ █  █
█    █  █   █ █ █  █  █
█    ████ ████ █  █ ████`}
              </pre>
              <p className='text-text-secondary text-sm mb-2'>
                <span className='text-ok-400'>➜</span> An unexpected error
                occurred:
              </p>
              <p className='text-coral text-xs mb-6 pl-4 border-l border-neutral-700'>
                {this.state.error?.message || 'Unknown error'}
              </p>
              <p className='text-text-secondary text-xs'>
                <span className='text-lagoon'>$</span> Try{' '}
                <button
                  className='text-dusk underline focus-ring'
                  onClick={() => window.location.reload()}
                >
                  reloading the page
                </button>{' '}
                or navigate back home.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
