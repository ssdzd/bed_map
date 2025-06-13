import React, { useEffect, useRef } from 'react';
import { paper } from 'paper';
import SvgParser from '../../utils/svgParser';
import { mockCamps } from '../../utils/mockData';

const MapLoader = () => {
  const canvasRef = useRef(null);
  const parserRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Paper.js
    paper.setup(canvasRef.current);
    parserRef.current = new SvgParser();

    // Set up the view
    const view = paper.view;
    view.viewSize = new paper.Size(800, 800);
    view.center = new paper.Point(400, 400);

    // Create test blocks for each ring
    const rings = ['A', 'B', 'C', 'D', 'E', 'F'];
    rings.forEach(ring => {
      // Create 8 blocks per ring (45 degrees each)
      for (let i = 0; i < 8; i++) {
        const startAngle = i * 45;
        const endAngle = (i + 1) * 45;
        const block = parserRef.current.createSimpleBlock(ring, startAngle, endAngle);
        
        // Create the path using PathItem.create
        const path = paper.PathItem.create(block.svgPath);
        
        // Style the path
        path.strokeColor = 'black';
        path.strokeWidth = 1;
        
        // Debug: log path bounds
        if (process.env.NODE_ENV === 'development') {
          console.log(`Block ${block.id} bounds:`, path.bounds);
        }
        
        // Find matching camp for this block
        const camp = mockCamps.find(c => {
          const [campRing, time] = c.placement_address.split(' & ');
          return campRing === ring;
        });

        // Set fill color based on camp status
        if (camp) {
          switch (camp.bed_status) {
            case 'video_complete':
              path.fillColor = '#FDE047'; // var(--bed-video)
              break;
            case 'buddy_assigned':
              path.fillColor = '#FB923C'; // var(--bed-buddy)
              break;
            case 'complete':
              path.fillColor = '#4ADE80'; // var(--bed-complete)
              break;
            default:
              path.fillColor = '#9CA3AF'; // var(--bed-none)
          }
        } else {
          path.fillColor = '#9CA3AF'; // var(--bed-none)
        }
      }
    });

    // Clean up
    return () => {
      paper.project.clear();
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <canvas
        ref={canvasRef}
        style={{
          border: '1px solid #ccc',
          borderRadius: '4px',
          backgroundColor: 'white'
        }}
      />
    </div>
  );
};

export default MapLoader;
