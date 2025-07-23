import { APIProvider, Map as GoogleMap, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { useState } from 'react';

export default function Map({ suggestions }) {
  const [selected, setSelected] = useState(null);

  const defaultCenter = suggestions.length > 0
    ? { lat: Number(suggestions[0].lat), lng: Number(suggestions[0].lng) }
    : { lat: 40.7128, lng: -74.0060 };

  return (
    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        style={{ width: '100%', height: 400, borderRadius: 8 }}
        defaultCenter={defaultCenter}
        defaultZoom={13}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        mapId={process.env.REACT_APP_GOOGLE_MAP_ID}
      >
        {suggestions.map((s, i) => (
          <AdvancedMarker
            key={i}
            position={{ lat: Number(s.lat), lng: Number(s.lng) }}
            onClick={() => setSelected(s)}
          >
            <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
          </AdvancedMarker>
        ))}
        {selected && (
          <InfoWindow
            position={{ lat: Number(selected.lat), lng: Number(selected.lng) }}
            onCloseClick={() => setSelected(null)}
          >
            <div>
              <h4>{selected.title}</h4>
              <p>{selected.description}</p>
              <p>
                <strong>Cost:</strong> {selected.cost}<br />
                <strong>Location:</strong> {selected.address}
              </p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </APIProvider>
  );
} 