"use client"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import useLogStore from '@/stores/logStore';
import { useShallow } from 'zustand/shallow';
import { useCallback, useEffect, useMemo} from 'react';

// #region Sample data
function computeGraphData(logs) {
    let data = [];
    let count;
    for (let i = 0; i < 24; i++) {
        count = logs.filter((log) => log.timestamp.getHours() === i).length;
        data.push({ time: `${i}:00`, count: count });
    }
    return data;
}
export default function LogLineGraph() {
    const { fetchLogs, logs, error, isLoading} = useLogStore(useShallow((s) => ({
        fetchLogs: s.fetchLogs,
        logs: s.logs,
        error: s.error,
        isLoading: s.isLoading,
    })));
    const data = useMemo(() => computeGraphData(logs), [logs]);
    const fetchTodayLogs = useCallback( () => {
        const TODAY = new Date(); TODAY.setHours(0,0,0,0);
        fetchLogs({timestamp: {
            gte: TODAY, 
        }});
    },[fetchLogs]);

    useEffect(() => {
        fetchTodayLogs();
    }, [fetchTodayLogs]);
    return (
        <>
        {!isLoading && 
            <div style={{ width: '100%', height: '100%' }} className='bg-base-100'>
            {error ?
                (
                    <p className='text-error'>{error}</p>

                ) : (
                    <ResponsiveContainer >
                    <LineChart
                    data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-3)" />
                    <XAxis dataKey="time" stroke="var(--color-text-3)" />
                    <YAxis stroke="var(--color-text-3)" />
                    <Tooltip
                    cursor={{ stroke: 'var(--color-border-2)' }}
                    contentStyle={{
                        backgroundColor: 'var(--color-surface-raised)',
                            borderColor: 'var(--color-border-2)',
                    }}
                    />
                    <Legend />
                    <Line
                    type="monotone"
                    dataKey="count"
                    stroke="var(--color-primary)"
                    fill="ff0000"
                    strokeWidth={3}

                    />
                    </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        }
        </>
    );
}
