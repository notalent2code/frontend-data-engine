import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { FC, useCallback, useState } from 'react';
import usePlacesAutoComplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from '@reach/combobox';
import '@reach/combobox/styles.css';

interface MapProps {
  type: 'search' | 'view';
  latitude: number;
  longitude: number;
  // eslint-disable-next-line no-unused-vars
  onMapClick?: (latLng: { lat: number; lng: number }) => void;
  // eslint-disable-next-line no-unused-vars
  onSearchChange?: (address: string) => void;
}

const Map: FC<MapProps> = ({
  type,
  latitude,
  longitude,
  onMapClick,
  onSearchChange,
}) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ['places'],
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

  return (
    isLoaded && (
      <div className='flex flex-col gap-2'>
        {type === 'search' && (
          <PlacesAutoComplete
            onMapClick={onMapClick}
            onSearchChange={onSearchChange}
          />
        )}

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
        >
          <Marker
            position={{
              lat: latitude,
              lng: longitude,
            }}
          />
        </GoogleMap>
      </div>
    )
  );
};

interface PlacesAutoCompleteProps {
  // eslint-disable-next-line no-unused-vars
  onMapClick?: (latLng: { lat: number; lng: number }) => void;
  // eslint-disable-next-line no-unused-vars
  onSearchChange?: (address: string) => void;
}

const PlacesAutoComplete: FC<PlacesAutoCompleteProps> = ({
  onMapClick,
  onSearchChange,
}) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutoComplete();

  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();

    const results = await getGeocode({ address });
    const { lat, lng } = getLatLng(results[0]);

    onSearchChange?.(address);
    onMapClick?.({ lat, lng });
  };

  return (
    <Combobox onSelect={handleSelect}>
      <ComboboxInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        className='w-full p-2'
        placeholder='Search an address'
      />
      <ComboboxPopover>
        <ComboboxList>
          {status === 'OK' &&
            data.map(({ place_id, description }) => (
              <ComboboxOption key={place_id} value={description} />
            ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
};

export default Map;
