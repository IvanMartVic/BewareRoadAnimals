import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"

export default function MyMap(props) {
    const { position, zoom, devices } = props

    var redIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    return (<MapContainer center={position} zoom={zoom} scrollWheelZoom={false} style={{ height: "60%", width: "60%" }}>
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {devices && devices.map((d) => {
            return (
                <Marker key={d.id} position={[d.coordLatitude, d.coordLength]} icon={redIcon}>
                    <Popup>
                        Dispositivo {d.id}. <br /> desplegado por {d.deployedBy?.full_name || "Desconocido"}
                    </Popup>
                </Marker>
            );
        })}
    </MapContainer>)
}
