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
      const { AdvancedMarkerElement } = await google.maps.importLibrary(
        'marker'
      );
      const position = {
        lat: coords.latitude,
        lng: coords.longitude,
      };

      // map options
      const image =
        'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
      const mapOptions = {
        center: position,
        zoom: 10,
        mapId: 'MY_NEXTJS_MAP_ID',
      };

      const map = new Map(mapRef.current, mapOptions);

      const marker = new AdvancedMarkerElement({
        map,
        position: { lat: coords.latitude, lng: coords.longitude },
        title: coords.temp,
      });
    };

    initMap();
  }, [coords]);

  console.log(coords.temp);

  return (
    <div
      style={{
        height: '600px',
        width: '1200px',
        margin: 'auto',
        borderRadius: '20px',
        marginBottom: '65px',
      }}
      ref={mapRef}
    ></div>
  );
};
