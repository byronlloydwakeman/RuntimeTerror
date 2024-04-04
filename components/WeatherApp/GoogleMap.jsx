'use server';

import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

export const GoogleMap = (coords) => {
  // MAP DEFINITION

  const mapRef = useRef(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY,
        version: 'weekly',
      });

      const { Map } = await loader.importLibrary('maps');
      const position = {
        lat: coords.latitude,
        lng: coords.longitude,
      };

      // map options

      const mapOptions = {
        center: position,
        zoom: 17,
        mapId: 'MY_NEXTJS_MAP_ID',
      };

      const map = new Map(mapRef.current, mapOptions);
    };

    initMap();
  }, [coords.latitude, coords.longitude]);

  return <div style={{ height: '600px' }} ref={mapRef}></div>;
};
