import React, { useEffect, useMemo } from 'react';
import useLogStore from '@/stores/logStore';
import useAuthStore from "@/stores/authStore";
import { useShallow } from 'zustand/shallow';

// Mock data generator: [{ day: 0, hour: 0, value: 5 }, ...]
const generateData = (logs) => {
    const data = [];
    if(logs.length == 0){
        return data;
    }
    for (let m = 0; m < 12; m++) {
        // console.log(`Logs: ${JSON.stringify(logs)}`)
        const month_logs = logs.filter((l) => l.timestamp.getMonth() == (m + 1))
        for (let h = 0; h < 24; h++) {
            data.push({
                month: m,
                hour: h,
                value: month_logs.filter((l) => l.timestamp.getHours() == h).length
            });
        }
    }
    return data;
};

const Heatmap = () => {
    const { fetchLogs, logs, error, isLoading } = useLogStore(useShallow((s) => ({
        fetchLogs: s.fetchLogs,
        logs: s.logs,
        error: s.error,
        isLoading: s.isLoading,
    })));
    const { fetchAuthUser, auth_error, userId, isLoadingAuth } = useAuthStore(useShallow(
        (s) => ({
            fetchAuthUser: s.fetchAuthUser,
            auth_error: s.error,
            userId: s.userId,
            isLoadingAuth: s.isLoading,
        })));
    // const data = generateData(logs);
    const data = useMemo(() => {
        if (!isLoading) {
            return generateData(logs)
        }else{
            return [];
        }
    }, [logs, isLoading]);
    const month = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

    useEffect(() => {
        if (!userId) {
            fetchAuthUser()
        }
    }, [fetchAuthUser, userId]);
    useEffect(() => {
        if (userId) {
            fetchLogs({ userId: userId });
        }
    }, [fetchLogs, userId]);

    const getColor = (value) => {
        if (value === 0) return 'bg-gray-100';
        if (value < 3) return 'bg-red-200';
        if (value < 10) return 'bg-red-400';
        if (value < 16) return 'bg-red-600';
        return 'bg-red-800';
    };

    return (
        <>
            {!isLoading && !isLoadingAuth &&
                <div className="p-8 bg-white rounded-lg shadow-sm w-full h-full overflow-x-auto">

                    <h1 className='w-full text-center text-gray-500'>Resumen detecciones por meses</h1>
                    <div className="flex">

                        <div className="flex flex-col justify-between pr-4 mt-8 text-xs text-gray-400">
                            {hours.map((h, i) => (
                                <div key={h} className="h-3">{i % 3 === 0 ? h : ''}</div>
                            ))}
                        </div>
                        <div className="flex-1">
                            {/* X-Axis: Days */}
                            <div className="grid grid-cols-12 mb-2 text-xs text-gray-400 text-center">
                                {month.map(day => <div key={day}>{day}</div>)}
                            </div>

                            <div className="grid grid-cols-12 gap-1">
                                {Array.from({ length: 24 }).map((_, hourIdx) => (
                                    <React.Fragment key={hourIdx}>
                                        {month.map((_, monthInx) => {
                                            const entry = data.find(d => d.month === monthInx && d.hour === hourIdx);
                                            return (
                                                <div
                                                    key={`${monthInx}-${hourIdx}`}
                                                    title={`${month[monthInx]}, hora ${hourIdx}: ${entry?.value} detecciones`}
                                                    className={`h-2 w-full rounded-sm ${getColor(entry?.value || 0)} transition-colors hover:ring-1 hover:ring-gray-400`}
                                                />
                                            );
                                        })}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            }

        </>
    );
};

export default Heatmap;
