import React, { useRef, useEffect, useState, useCallback } from 'react';

export interface Point {
  x: number;
  y: number;
}

export interface Annotation {
  type: 'line' | 'angle' | 'rect';
  points: Point[];
  timestamp: number;
  color: string;
}

interface Props {
  videoRef: React.RefObject<HTMLVideoElement>;
  currentTime: number;
  currentTool: 'line' | 'angle' | 'rect' | 'eraser' | null;
  onAnnotationsChange?: (annotations: Annotation[]) => void;
  initialAnnotations?: Annotation[];
  shouldReset?: boolean;
}

export default function VideoAnnotationCanvas({
  videoRef,
  currentTime,
  currentTool,
  onAnnotationsChange,
  initialAnnotations = [],
  shouldReset = false
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>(initialAnnotations);
  const [drawing, setDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);

  // Handle reset
  useEffect(() => {
    if (shouldReset) {
      setAnnotations([]);
      setCurrentPoints([]);
    }
  }, [shouldReset]);

  // Load initial annotations
  useEffect(() => {
    setAnnotations(initialAnnotations);
  }, [initialAnnotations]);

  // Notify parent of annotation changes
  useEffect(() => {
    onAnnotationsChange?.(annotations);
  }, [annotations, onAnnotationsChange]);

  // Update canvas size to match video
  useEffect(() => {
    function resizeCanvas() {
      if (!canvasRef.current || !videoRef.current) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;

      canvas.width = video.offsetWidth;
      canvas.height = video.offsetHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [videoRef]);

  // Draw annotations
  const drawAnnotations = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw existing annotations for current time
    const relevantAnnotations = annotations.filter(
      ann => Math.abs(ann.timestamp - currentTime) < 0.5
    );

    relevantAnnotations.forEach(annotation => {
      ctx.strokeStyle = annotation.color;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (annotation.type === 'line' && annotation.points.length >= 2) {
        ctx.beginPath();
        ctx.moveTo(annotation.points[0].x, annotation.points[0].y);
        ctx.lineTo(annotation.points[1].x, annotation.points[1].y);
        ctx.stroke();
      } else if (annotation.type === 'angle' && annotation.points.length >= 3) {
        // Draw angle with three points
        ctx.beginPath();
        ctx.moveTo(annotation.points[0].x, annotation.points[0].y);
        ctx.lineTo(annotation.points[1].x, annotation.points[1].y);
        ctx.lineTo(annotation.points[2].x, annotation.points[2].y);
        ctx.stroke();

        // Calculate and display angle
        const angle = calculateAngle(annotation.points[0], annotation.points[1], annotation.points[2]);
        ctx.fillStyle = annotation.color;
        ctx.font = '16px Arial';
        ctx.fillText(`${angle.toFixed(1)}°`, annotation.points[1].x + 10, annotation.points[1].y - 10);
      } else if (annotation.type === 'rect' && annotation.points.length >= 2) {
        const width = annotation.points[1].x - annotation.points[0].x;
        const height = annotation.points[1].y - annotation.points[0].y;
        ctx.strokeRect(annotation.points[0].x, annotation.points[0].y, width, height);
      }
    });

    // Draw current drawing in progress
    if (drawing && currentPoints.length > 0) {
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (currentTool === 'line' && currentPoints.length === 2) {
        ctx.beginPath();
        ctx.moveTo(currentPoints[0].x, currentPoints[0].y);
        ctx.lineTo(currentPoints[1].x, currentPoints[1].y);
        ctx.stroke();
      } else if (currentTool === 'angle') {
        ctx.beginPath();
        ctx.moveTo(currentPoints[0].x, currentPoints[0].y);
        for (let i = 1; i < currentPoints.length; i++) {
          ctx.lineTo(currentPoints[i].x, currentPoints[i].y);
        }
        ctx.stroke();

        if (currentPoints.length === 3) {
          const angle = calculateAngle(currentPoints[0], currentPoints[1], currentPoints[2]);
          ctx.fillStyle = '#3B82F6';
          ctx.font = '16px Arial';
          ctx.fillText(`${angle.toFixed(1)}°`, currentPoints[1].x + 10, currentPoints[1].y - 10);
        }
      } else if (currentTool === 'rect' && currentPoints.length === 2) {
        const width = currentPoints[1].x - currentPoints[0].x;
        const height = currentPoints[1].y - currentPoints[0].y;
        ctx.strokeRect(currentPoints[0].x, currentPoints[0].y, width, height);
      }
    }
  }, [annotations, currentTime, currentPoints, drawing, currentTool]);

  // Redraw when needed
  useEffect(() => {
    drawAnnotations();
  }, [drawAnnotations]);

  // Calculate angle between three points
  function calculateAngle(p1: Point, p2: Point, p3: Point): number {
    const radians = Math.atan2(p3.y - p2.y, p3.x - p2.x) - Math.atan2(p1.y - p2.y, p1.x - p2.x);
    let degrees = (radians * 180) / Math.PI;
    if (degrees < 0) degrees += 360;
    return degrees;
  }

  // Get mouse position relative to canvas
  function getMousePos(e: React.MouseEvent<HTMLCanvasElement>): Point {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  // Mouse event handlers
  function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!currentTool || currentTool === 'eraser') return;

    const pos = getMousePos(e);

    if (currentTool === 'line' || currentTool === 'rect') {
      setDrawing(true);
      setCurrentPoints([pos]);
    } else if (currentTool === 'angle') {
      if (currentPoints.length < 2) {
        setCurrentPoints([...currentPoints, pos]);
      } else {
        // Complete the angle
        const newAnnotation: Annotation = {
          type: 'angle',
          points: [...currentPoints, pos],
          timestamp: currentTime,
          color: '#3B82F6'
        };
        setAnnotations([...annotations, newAnnotation]);
        setCurrentPoints([]);
      }
    }
  }

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!drawing) {
      // For angle tool, show preview lines
      if (currentTool === 'angle' && currentPoints.length > 0 && currentPoints.length < 3) {
        const pos = getMousePos(e);
        setCurrentPoints(prev => {
          const newPoints = [...prev];
          if (newPoints.length === 1) {
            return [newPoints[0], pos];
          } else if (newPoints.length === 2) {
            return [newPoints[0], newPoints[1], pos];
          }
          return newPoints;
        });
      }
      return;
    }

    const pos = getMousePos(e);

    if (currentTool === 'line' || currentTool === 'rect') {
      setCurrentPoints([currentPoints[0], pos]);
    }
  }

  function handleMouseUp() {
    if (!drawing) return;

    if (currentPoints.length === 2 && (currentTool === 'line' || currentTool === 'rect')) {
      const newAnnotation: Annotation = {
        type: currentTool,
        points: currentPoints,
        timestamp: currentTime,
        color: '#3B82F6'
      };
      setAnnotations([...annotations, newAnnotation]);
    }

    setDrawing(false);
    if (currentTool !== 'angle') {
      setCurrentPoints([]);
    }
  }

  function handleClick(e: React.MouseEvent<HTMLCanvasElement>) {
    if (currentTool === 'eraser') {
      const pos = getMousePos(e);
      // Remove annotations near the click
      setAnnotations(annotations.filter(ann => {
        return !ann.points.some(point =>
          Math.abs(point.x - pos.x) < 20 && Math.abs(point.y - pos.y) < 20
        );
      }));
    }
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full cursor-crosshair"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      style={{ pointerEvents: currentTool ? 'auto' : 'none' }}
    />
  );
}
