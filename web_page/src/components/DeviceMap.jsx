import { MapContainer, Marker, TileLayer, Popup, LayerGroup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import MarkerClusterGroup from "react-leaflet-markercluster";
import 'react-leaflet-markercluster/styles'


export default function MyMap(props) {
    let { position, zoom, devices, scrollWheelZoom, clickFunction } = props

    var redIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    // clickFunction = clickFunction ?? (() => { });

    return (
        <MapContainer center={position} zoom={zoom} scrollWheelZoom={scrollWheelZoom ?? false} style={{ height: "90%", width: "90%" }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MarkerClusterGroup>
                {devices && devices.map((d) => {
                    return (
                        <Marker key={d.id}
                            position={[d.coordLatitude, d.coordLength]}
                            icon={redIcon}
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
