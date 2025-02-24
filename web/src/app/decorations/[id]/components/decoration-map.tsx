import { MapPin } from "@phosphor-icons/react";
import { GeolocateControl, Map, Marker, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const mapBoxToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY as string;

interface Props {
  latitude: number;
  longitude: number;
}

export const DecorationMap = ({ latitude, longitude }: Props) => {
  return (
    <Map
      mapboxAccessToken={mapBoxToken}
      initialViewState={{
        latitude,
        longitude,
        zoom: 16,
      }}
      viewState={{
        latitude,
        longitude,
        zoom: 15,
        bearing: 0,
        pitch: 0,
        padding: { top: 0, bottom: 0, left: 0, right: 0 },
        width: 800,
        height: 600,
      }}
      maxZoom={20}
      minZoom={3}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      style={{ borderRadius: "10px" }}
    >
      <GeolocateControl />
      <NavigationControl />
      <Marker latitude={latitude} longitude={longitude} anchor="bottom">
        <MapPin size={32} weight="fill" color="#db2626" />
      </Marker>
    </Map>
  );
};
