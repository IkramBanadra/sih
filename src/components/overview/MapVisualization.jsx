import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';



const activityData = [
    { location: [18.5204, 73.8567], participants: 150, theme: 'Cleanliness Drive' }, 
    { location: [19.2183, 72.9781], participants: 120, theme: 'Energy Saving' }, 
    { location: [13.0827, 80.2707], participants: 250, theme: 'Water Conservation' }, 
   
];

const MapVisualization = () => {
    return (
        <div className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8'>
            <h2 className='text-lg font-medium mb-4 text-gray-100'>Geographic Spread Activity</h2>
            <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "500px", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {activityData.map((activity, index) => (
                    <Marker
                        key={index}
                        position={activity.location}
                    >
                        <Popup>
                            <div>
                                <strong>Theme:</strong> {activity.theme}<br />
                                <strong>Participants:</strong> {activity.participants}
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapVisualization;