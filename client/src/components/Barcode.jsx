import { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { motion } from 'framer-motion';

// Barcodes render by calling JsBarcode directly into an SVG ref.
// Why no wrapper: `react-barcodes` (deprecated) declared peer react@^17 /
// react-dom@^17 against this repo's React 19 — the source of every ERESOLVE
// install failure and the reason client installs needed --legacy-peer-deps.
// jsbarcode is the exact engine react-barcodes wrapped internally (same
// options object, same SVG renderer), so the visual output is identical by
// construction.
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
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const options = {
      format,
      width,
      height,
      displayValue: false,
      background,
      lineColor,
    };

    // Start from a blank slate so a failed re-render leaves nothing behind.
    svg.replaceChildren();

    try {
      JsBarcode(svg, value || 'PORTFOLIO', options);
    } catch {
      // JsBarcode throws on input invalid for the chosen format (e.g. EAN
      // demands exact lengths/checksums). Degrade to the safe default rather
      // than crash the tree; if even that fails, the cleared svg above
      // renders nothing.
      try {
        JsBarcode(svg, 'PORTFOLIO', { ...options, format: 'CODE128' });
      } catch {
        /* nothing renderable — leave the svg empty */
      }
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
