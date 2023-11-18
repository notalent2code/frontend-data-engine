import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { FC, useCallback, useState } from 'react';

interface MapProps {
  latitude: number;
  longitude: number;
}

const Map: FC<MapProps> = ({ latitude, longitude }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const [map, setMap] = useState(null);

  const onLoad = useCallback(() => {
    setMap(map);
  }, [map]);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const containerStyle = {
    width: '100%',
    height: '400px',
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={{
        lat: latitude,
        lng: longitude,
      }}
      zoom={15}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      <Marker
        position={{
          lat: latitude,
          lng: longitude,
        }}
      />
    </GoogleMap>
  ) : (
    <></>
  );
};

export default Map;
