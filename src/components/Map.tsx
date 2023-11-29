import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { FC, useCallback, useState } from 'react';

interface MapProps {
  latitude: number;
  longitude: number;
  // eslint-disable-next-line no-unused-vars
  onMapClick?: (latLng: { lat: number; lng: number }) => void;
}

const Map: FC<MapProps> = ({ latitude, longitude, onMapClick }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const [map, setMap] = useState(null);
  const [clickedLatLng, setClickedLatLng] = useState<{
    lat: number | null;
    lng: number | null;
  }>({ lat: null, lng: null });

  const onLoad = useCallback(() => {
    setMap(map);
  }, [map]);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      const lat = e.latLng?.lat();
      const lng = e.latLng?.lng();
      if (lat && lng) {
        setClickedLatLng({ lat, lng });
        onMapClick?.({ lat, lng });
      }
    },
    [onMapClick]
  );

  const containerStyle = {
    width: '100%',
    height: '400px',
  };

  return isLoaded ? (
    <GoogleMap
      options={{}}
      mapContainerStyle={containerStyle}
      center={{
        lat: latitude,
        lng: longitude,
      }}
      zoom={15}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onClick={handleMapClick}
    >
      <Marker
        position={{
          lat: clickedLatLng.lat || latitude,
          lng: clickedLatLng.lng || longitude,
        }}
      />
    </GoogleMap>
  ) : (
    <></>
  );
};

export default Map;
