import React, { useEffect, useMemo } from 'react';
import useLogStore from '@/stores/logStore';
import useAuthStore from "@/stores/authStore";
import { useShallow } from 'zustand/shallow';

// Mock data generator: [{ day: 0, hour: 0, value: 5 }, ...]
const getDayHelper = (timestamp_day) => {
    if(timestamp_day == 0){
        return 6;
    }else{
        return timestamp_day - 1;
    }

}
const generateData = (logs) => {
    const data = [];
    if(logs.length == 0){
        return data;
    }
    for (let m = 0; m < 12; m++) {
        // console.log(`Logs: ${JSON.stringify(logs)}`)
        const month_logs = logs.filter((l) => l.timestamp.getMonth() == (m + 1))
        for (let d = 0; d < 7; d++) {
            data.push({
                month: m,
                day: d,
                value: month_logs.filter((l) => getDayHelper(l.timestamp.getDay()) == d).length
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
    const days = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie','Sab', 'Dom'];

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
                <div className="p-[5%] bg-white rounded-lg shadow-sm w-full h-full overflow-x-auto flex flex-col">

                    <h1 className='w-full text-center text-gray-500'>Detecciones por días de la semana</h1>
                    <div className="flex h-full justify-center items-center">

                        <div className="flex flex-col justify-between pr-[3%] mt-[8%] text-xs text-gray-400 h-11/12">
                            {days.map((h, i) => (
                                <div key={i} className="h-[1/9]">{h}</div>
                            ))}
                        </div>
                        <div className="flex-1 h-full">
                            {/* X-Axis: Days */}
                            <div className="grid grid-cols-12 mb-[0.5%] text-xs text-gray-400 text-center">
                                {month.map(day => <div key={day} className='w-1/12'>{day}</div>)}
                            </div>

                            <div className="grid grid-cols-12 gap-1 h-full">
                                {Array.from({ length: 7 }).map((_, dayIdx) => (
                                    <React.Fragment key={dayIdx}>
                                        {month.map((_, monthInx) => {
                                            const entry = data.find(d => d.month === monthInx && d.day=== dayIdx);
                                            return (
                                                <div
                                                    key={`${monthInx}-${dayIdx}`}
                                                    title={`${month[monthInx]}, ${days[dayIdx]}: ${entry?.value} detecciones`}
                                                    className={`h-[1/7] w-full rounded-sm ${getColor(entry?.value || 0)} transition-colors hover:ring-1 hover:ring-gray-400`}
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
