import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const Barcode = ({
  value,
  className = '',
  format = 'CODE128',
  lineColor = 'var(--color-dusk)',
  background = 'transparent',
  height = 40,
  width = 2,
  animated = true,
}) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (svgRef.current) {
      // Dynamically import jsbarcode to avoid SSR issues
      import('jsbarcode').then((JsBarcodeModule) => {
        const JsBarcode = JsBarcodeModule.default || JsBarcodeModule;
        try {
          JsBarcode(svgRef.current, value || 'PORTFOLIO', {
            format,
            width,
            height,
            displayValue: false,
            background,
            lineColor,
          });
        } catch (e) {
          console.error('Barcode generation error:', e);
        }
      });
    }
  }, [value, format, width, height, background, lineColor]);

  if (animated) {
    return (
      <motion.svg
        ref={svgRef}
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

  return <svg ref={svgRef} className={className} />;
};

export default Barcode;
