import PropTypes from 'prop-types';

/**
 * Traffic-light header row used at the top of every terminal-style panel.
 *
 * Props:
 *   filename     string  — label shown after the dots   default: "process.exe"
 *   className    string  — extra classes on the wrapper  default: ""
 *   labelClassName string — extra classes on the label   default: ""
 */
const TerminalHeader = ({
  filename = 'process.exe',
  className = '',
  labelClassName = '',
}) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <div className='terminal-status__dot bg-brand-secondary' />
    <div className='terminal-status__dot bg-brand-accent' />
    <div className='terminal-status__dot bg-brand-primary' />
    <span
      className={`ml-4 font-mono text-xs text-text-secondary ${labelClassName}`}
    >
      {filename}
    </span>
  </div>
);

TerminalHeader.propTypes = {
  filename: PropTypes.string,
  className: PropTypes.string,
  labelClassName: PropTypes.string,
};

export default TerminalHeader;
