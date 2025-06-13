import { paper } from 'paper';

class SvgParser {
  constructor() {
    // No hidden canvas setup here
  }

  /**
   * Extracts path data for a specific ring from the SVG document
   * @param {Document} doc - The SVG document
   * @param {string} ring - The ring identifier (e.g., 'A', 'B', 'C')
   * @returns {string} The path data string
   */
  extractRingPath(doc, ring) {
    const ringElement = doc.querySelector(`#Ring_Roads #${ring} path`);
    if (!ringElement) {
      throw new Error(`Ring ${ring} not found in SVG`);
    }
    return ringElement.getAttribute('d');
  }

  /**
   * Creates a simplified block shape for testing purposes
   * @param {string} ring - The ring identifier (e.g., 'A', 'B', 'C')
   * @param {number} startAngle - Start angle in degrees
   * @param {number} endAngle - End angle in degrees
   * @returns {Object} Object containing SVG path data and bounds
   */
  createSimpleBlock(ring, startAngle, endAngle) {
    const centerX = 400;
    const centerY = 400;
    const scale = 0.8; // Zoom out
    const baseRadius = 100;
    const ringWidth = 30;
    const innerRadius = (baseRadius + (ring.charCodeAt(0) - 65) * ringWidth) * scale;
    const outerRadius = (innerRadius + ringWidth * scale);
    
    // Convert angles to radians
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    // Calculate points for the wedge shape, offset by center
    const x1 = centerX + innerRadius * Math.cos(startRad);
    const y1 = centerY + innerRadius * Math.sin(startRad);
    const x2 = centerX + innerRadius * Math.cos(endRad);
    const y2 = centerY + innerRadius * Math.sin(endRad);
    const x3 = centerX + outerRadius * Math.cos(endRad);
    const y3 = centerY + outerRadius * Math.sin(endRad);
    const x4 = centerX + outerRadius * Math.cos(startRad);
    const y4 = centerY + outerRadius * Math.sin(startRad);
    
    // Create the path data string
    const svgPath = `M ${x1} ${y1} A ${innerRadius} ${innerRadius} 0 0 1 ${x2} ${y2} 
            L ${x3} ${y3} A ${outerRadius} ${outerRadius} 0 0 0 ${x4} ${y4} Z`;

    // Return the SVG path string only
    return {
      id: `${ring}-${startAngle}-${endAngle}`,
      svgPath
    };
  }

  /**
   * Parses an SVG document and extracts all ring paths
   * @param {Document} doc - The SVG document
   * @returns {Object} Object containing path data for each ring
   */
  parseSvg(doc) {
    const rings = {};
    const ringElements = doc.querySelectorAll('#Ring_Roads path');
    
    ringElements.forEach(element => {
      const ringId = element.parentElement.id;
      rings[ringId] = element.getAttribute('d');
    });
    
    return rings;
  }
}

export default SvgParser;
