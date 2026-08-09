import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import 'react-leaflet-markercluster/styles'
import { useMemo, useRef, useState } from "react";


export default function InputMap(props) {
    let { position, zoom, scrollWheelZoom, markerRef, markerPosition, setMarkerPosition } = props

    var redIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    const eventHandlers = useMemo(() => ({
        dragend() {
            const marker = markerRef.current;
            if (null != marker) {
                const newPos = marker.getLatLng();
                setMarkerPosition([newPos.lat, newPos.lng]);
                console.log("Marker dropped at:", newPos.lat, newPos.lng);
            }
        }

    }), [markerRef, setMarkerPosition]);

    return (
        <MapContainer center={position} zoom={zoom} scrollWheelZoom={scrollWheelZoom ?? false} style={{ height: "90%", width: "90%" }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
                draggable={true}
                eventHandlers={eventHandlers}
                position={markerPosition}
                ref={markerRef}
                icon={redIcon}
            >
            </Marker>
        </MapContainer>)
}
