import { useEffect, useState } from "react";

export function DetectWarningNotification({ detection }) {
    const [detailedMessage, setMessage] = useState(buildSimpleMessage(detection));

    async function getLocationName(lat, lng) {
        if (!lat || !lng) return "Ubicación desconocida";

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=12`,
                {
                    headers: {
                        "User-Agent": "WildlifeDetectionApp/1.0"
                    }
                }
            );

            if (!response.ok) throw new Error("Error en la API");

            const data = await response.json();
            const addr = data.address || {};

            // Intentamos obtener el lugar más representativo (pueblo, ciudad, municipio o provincia)
            const lugar = addr.village || addr.town || addr.city || addr.municipality || addr.county || addr.state;

            if (lugar) {
                const provincia = addr.province || addr.state;
                return provincia && provincia !== lugar ? `${lugar} (${provincia})` : lugar;
            }

            return data.display_name?.split(",")[0] || "Zona rural";
        } catch (error) {
            // FALLBACK LEGIBLE: Si falla la conexión o la API nos bloquea
            const latFixed = Number(lat).toFixed(3);
            const lngFixed = Number(lng).toFixed(3);
            return `Zona rural (${latFixed}°, ${lngFixed}°)`;
        }
    }

    async function buildDetailsMessage(log) {
        if (!log?.message) return "Sin datos de detección";

        try {
            const details = JSON.parse(log.message);
            const names = {};

            for (const d of details) {
                const animal = d.name;
                names[animal] = (names[animal] || 0) + 1;
            }

            const locationText = await getLocationName(
                log.deviceIn?.coordLatitude,
                log.deviceIn?.coordLength
            );

            const parts = [];
            for (const [animal, count] of Object.entries(names)) {
                parts.push(`${count} ${animal}`);
            }

            return `${parts.join(", ")} en ${locationText}`;
        } catch (e) {
            return "Error al procesar la alerta";
        }
    }
    function buildSimpleMessage(log) {
        if (!log?.message) return "Sin datos de detección";

        try {
            const details = JSON.parse(log.message);
            const names = {};

            for (const d of details) {
                const animal = d.name;
                names[animal] = (names[animal] || 0) + 1;
            }

            const locationText = [
                log.deviceIn?.coordLatitude,
                log.deviceIn?.coordLength
            ];

            const parts = [];
            for (const [animal, count] of Object.entries(names)) {
                parts.push(`${count} ${animal}`);
            }

            return `${parts.join(", ")} en ${locationText}`;
        } catch (e) {
            return "Error al procesar la alerta";
        }

    }

    useEffect(() => {
        let isMounted = true;

        buildDetailsMessage(detection).then((text) => {
            if (isMounted) setMessage(text);
        });

        return () => {
            isMounted = false;
        };
    }, [detection]);

    return (
        <div role="alert" className="alert alert-warning">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>ALERTA: {detailedMessage}</span>
        </div>
    );
}
