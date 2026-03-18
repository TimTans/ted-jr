"use client";
import { useState } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";

interface Store {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

const stores: Store[] = [
  {
    id: 1,
    name: "ShopRite Queens",
    lat: 40.7844,
    lng: -73.8441,
    address: "ShopRite Queens, 11356",
  },
  {
    id: 2,
    name: "ShopRite Brooklyn",
    lat: 40.6195,
    lng: -73.9584,
    address: "ShopRite Brooklyn, 11230",
  },
];

const center = {
  lat: (stores[0].lat + stores[1].lat) / 2,
  lng: (stores[0].lng + stores[1].lng) / 2,
};

const containerStyle = {
  width: "100%",
  height: "100%",
};

const StoreMap = () => {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 40%, #A5D6A7 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "1rem",
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(45,106,79,0.5)"
          strokeWidth="1.5"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <span
          style={{
            marginTop: "0.5rem",
            fontSize: "0.75rem",
            fontWeight: 500,
            color: "rgba(45,106,79,0.7)",
          }}
        >
          Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable map
        </span>
      </div>
    );
  }

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={11}
      >
        {stores.map((store) => (
          <Marker
            key={store.id}
            position={{ lat: store.lat, lng: store.lng }}
            onClick={() => setSelectedStore(store)}
          />
        ))}

        {selectedStore && (
          <InfoWindow
            position={{ lat: selectedStore.lat, lng: selectedStore.lng }}
            onCloseClick={() => setSelectedStore(null)}
          >
            <div>
              <strong>{selectedStore.name}</strong>
              <br />
              {selectedStore.address}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default StoreMap;
