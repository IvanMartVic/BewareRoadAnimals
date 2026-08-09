import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import MarkerClusterGroup from "react-leaflet-markercluster";
import 'react-leaflet-markercluster/styles'


export default function MyMap(props) {
    let { position, zoom, devices, scrollWheelZoom, clickFunction } = props
    var imageIcon = new L.Icon({
        iconUrl: '/video-camera.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 30],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    // clickFunction = clickFunction ?? (() => { });

    return (
        <MapContainer center={position} zoom={zoom} scrollWheelZoom={scrollWheelZoom ?? false} style={{ height: "100%", width: "100%" }}
            className="flex-2">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MarkerClusterGroup>
                {devices && devices.map((d) => {
                    return (
                        <Marker key={d.id}
                            position={[d.coordLatitude, d.coordLength]}
                            icon={imageIcon}
                            eventHandlers={{ click: (e) => clickFunction?.(d.id) }}>
                            <Popup>
                                Dispositivo {d.id}. <br /> desplegado por {d.deployedBy?.full_name || "Desconocido"}
                            </Popup>
                        </Marker>
                    );
                })}

            </MarkerClusterGroup>
        </MapContainer>)
}
