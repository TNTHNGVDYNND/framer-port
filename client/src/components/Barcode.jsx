import { useBarcode } from 'react-barcodes';
import { motion } from 'framer-motion';

const Barcode = ({
  value,
  className = '',
  format = 'CODE128',
  lineColor = 'var(--color-brand-accent)',
  background = 'transparent',
  height = 40,
  width = 2,
  animated = true,
}) => {
  const { inputRef } = useBarcode({
    value: value || 'PORTFOLIO',
    options: {
      format,
      width,
      height,
      displayValue: false,
      background,
      lineColor,
    },
  });

  if (animated) {
    return (
      <motion.svg
        ref={inputRef}
        className={className}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          ease: 'easeOut',
        }}
      />
    );
  }

  return <svg ref={inputRef} className={className} />;
};

export default Barcode;
