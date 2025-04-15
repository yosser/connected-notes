import React from 'react';

interface ArrowProps {
    start: { x: number; y: number };
    end: { x: number; y: number };
}

const Arrow: React.FC<ArrowProps> = ({ start, end }) => {
    // Calculate control points for a more natural curve
    const midX = (start.x + end.x) / 2;
    const distance = Math.abs(end.x - start.x);
    const controlY = Math.min(start.y, end.y) - (distance * 0.15); // Curve upward more

    // Calculate the tangent angle at the end point
    // For a quadratic Bézier curve, the tangent at the end point is the line from the control point to the end point
    const tangentAngle = Math.atan2(end.y - controlY, end.x - midX);

    // Arrow head size
    const headLength = 15;

    // Calculate the arrow head points using the tangent angle
    const arrowHead1 = {
        x: end.x - headLength * Math.cos(tangentAngle - Math.PI / 6),
        y: end.y - headLength * Math.sin(tangentAngle - Math.PI / 6)
    };

    const arrowHead2 = {
        x: end.x - headLength * Math.cos(tangentAngle + Math.PI / 6),
        y: end.y - headLength * Math.sin(tangentAngle + Math.PI / 6)
    };

    return (
        <svg
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 2,
            }}
        >
            {/* Curved line using quadratic Bézier curve */}
            <path
                d={`M ${start.x} ${start.y} Q ${midX} ${controlY} ${end.x} ${end.y}`}
                stroke="#666"
                strokeWidth="2"
                strokeDasharray="5,5"
                fill="none"
            />

            {/* Arrow head */}
            <path
                d={`M ${end.x} ${end.y} L ${arrowHead1.x} ${arrowHead1.y} L ${arrowHead2.x} ${arrowHead2.y} Z`}
                fill="#666"
            />

            {/* Connection point circles */}
            <circle
                cx={start.x}
                cy={start.y}
                r="4"
                fill="#666"
            />
            <circle
                cx={end.x}
                cy={end.y}
                r="4"
                fill="#666"
            />
        </svg>
    );
};

export default Arrow; 