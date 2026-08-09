import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import MarkerClusterGroup from "react-leaflet-markercluster";
import 'react-leaflet-markercluster/styles'


export default function LogsMap(props) {
    let { position, zoom, logs, scrollWheelZoom, clickFunction } = props
    var boarIcon = new L.Icon({
        iconUrl: '/wild-boar.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    var deerIcon = new L.Icon({
        iconUrl: '/deer-shape.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    var deerQuestionIcon = new L.Icon({
        iconUrl: '/deer-question.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [19, 30],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    // clickFunction = clickFunction ?? (() => { });
    let detectDetailsMessage = (log) => {
        let message = ""
        if (log.image != null) {
            const details = JSON.parse(log.message)
            const names = {}
            for (let d of details) {
                const animal = d.name
                if (names[animal] != undefined) {
                    names[animal] += 1
                } else {
                    names[animal] = 1
                }
            }
            for (const [key, value] of Object.entries(names)) {
                let out_key
                switch (key) {
                    case "deer":
                        out_key = "ciervo";
                        break;
                    case "boar":
                        out_key = "jabalí";
                        break;
                }
                message += value + " " + out_key + " detectados"
            }
        } else {
            message = log.message
        }
        return message
    }
    let animalIcon = (log) => {
        let icon = "";
        if (log.image != null) {
            const details = JSON.parse(log.message)
            const names = {}
            for (let d of details) {
                const animal = d.name
                if (names[animal] != undefined) {
                    names[animal] += 1
                } else {
                    names[animal] = 1
                }
            }
            let maxValue = 0;
            for (const [key, value] of Object.entries(names)) {
                if (value > maxValue) {
                    maxValue = value;
                    icon = key
                }
            }
        }
        switch (icon) {
            case "boar":
                return boarIcon;
            case "deer":
                return deerIcon;
            default:
                return deerQuestionIcon;
        }
    }
    return (
        <MapContainer center={position} zoom={zoom} scrollWheelZoom={scrollWheelZoom ?? false} dragging={false}
            doubleClickZoom={false} touchZoom={false} keyboard={false} zoomControl={false} style={{ height: "100%", width: "100%" }}
            className="z-0">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MarkerClusterGroup>
                {logs && logs.map((l) => {
                    return (
                        <Marker key={l.id}
                            position={[l.deviceIn.coordLatitude, l.deviceIn.coordLength]}
                            icon={animalIcon(l)}
                            eventHandlers={{ click: (e) => clickFunction?.(l.id) }}>
                            <Popup>
                                {detectDetailsMessage(l)}  <br />
                            </Popup>
                        </Marker>
                    );
                })}

            </MarkerClusterGroup>
        </MapContainer>)
}
