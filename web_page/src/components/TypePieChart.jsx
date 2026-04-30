"use client";
import {
    PieChart,
    Pie,
    ResponsiveContainer,
    Legend,
    Tooltip
} from 'recharts';

import useLogStore from "@/stores/logStore"
import { useEffect } from 'react';
import { useShallow } from 'zustand/shallow';



const renderPercentageLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
        return null;
    }
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const ncx = Number(cx);
    const x = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
    const ncy = Number(cy);
    const y = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

    return (
        <text x={x} y={y} fill="black" textAnchor={x > ncx ? 'start' : 'end'} dominantBaseline="central">
            {`${((percent ?? 1) * 100).toFixed(0)}%`}
        </text>
    );
};


export default function TypePieChart() {
    const { fetchLogTypeCount, detectCount, systemCount, batteryWarningCount, error} = useLogStore(useShallow(
        (s) => ({
            fetchLogTypeCount: s.fetchLogTypeCount,
            detectCount: s.detectCount,
            systemCount: s.systemCount,
            batteryWarningCount: s.batteryWarningCount,
            error: s.error,
        }
        )));
    const rawData = [
        { type: "SISTEMA", count: systemCount || 0, fill: "var(--color-base-300)" },
        { type: "BATERIA", count: batteryWarningCount || 0, fill: "var(--color-warning)" },
        { type: "DETECCION", count: detectCount || 0, fill: "var(--color-error)" },
    ];
    useEffect(() => {
        fetchLogTypeCount();
    }, [fetchLogTypeCount]);
    return (
        <div style={{ width: '100%', height: '100%' }} className='bg-base-100'>
            {error ? (
                <p className='text-error'>{error}</p>

            )
                : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                            <Pie
                                data={rawData}
                                dataKey="count"
                                nameKey="type"
                                cx="50%"
                                cy="50%"
                                outerRadius={"90%"}
                                isAnimationActive={false}
                                label={renderPercentageLabel}
                                labelLine={true}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                            <Tooltip
                            />
                        </PieChart>
                    </ResponsiveContainer>
                )
            }
        </div>
    );
}
