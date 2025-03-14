export interface User {
  id: string;
  externalId: string;
  name: string | null;
  email: string;
  image: string | null;
  emailVerified: boolean;
  provider: string;
  plan: string;
  admin: boolean;
  notificationsOnAppVerification: boolean;
  notificationsOnAppRating: boolean;
  notificationsByEmailVerification: boolean;
  notificationsByEmailRating: boolean;
  createdAt: Date;
  updatedAt: Date;
  ratings: Rating[];
  favourites: Favourite[];
  reports: Report[];
  verifications: Verification[];
}

export interface Decoration {
  id: string;
  name: string;
  address: string;
  verified: boolean;
  verificationSubmitted: boolean;
  verificationStatus: string;
  latitude: number;
  longitude: number;
  country: string;
  region: string;
  city: string;
  year: string;
  createdAt: string;
  userId: string;
  routeId: string | null;
  averageRating: string;
  ratingCount: number;
  viewCount: number;
  images: DecorationPicture[];
  ratings: Rating[];
  favourites: Favourite[];
}

export interface DecorationImage {
  id: string;
  url: string;
  index: number;
  base64Value: string;
}

export interface DecorationPicture {
  id: string;
  index: number;
  url: string;
  publicId: string;
  decorationId: string;
}

export interface EditableImage {
  id: string;
  index: number;
  url: string;
  publicId?: string;
  decorationId?: string;
  base64Value?: string;
}

export interface Notification {
  id: string;
  title: string;
  content: string;
  unread: boolean;
  createdAt: string;
  updatedAt?: string;
  userId: string;
}

export interface Rating {
  id: string;
  rating: number;
  createdAt: string;
  updatedAt?: string;
  decorationId: string;
  userId: string;
}

export interface Favourite {
  id: string;
  createdAt: string;
  decorationId: string;
  userId: string;
}

export interface Report {
  id: string;
  createdAt: string;
  decorationId: string;
  userId: string;
  reasons: string[];
  additionalInfo: string;
}

export interface Verification {
  id: string;
  createdAt: string;
  decorationId: string;
  userId: string;
  status: string;
  document: string;
  rejectedReason: string;
}

export interface MapboxSuggestion {
  full_address: string;
  mapbox_id: string;
  name?: string;
}

export interface MapboxProps {
  properties: {
    coordinates: {
      latitude: number;
      longitude: number;
    };
    context: {
      country: { name: string };
      region: { name: string };
      place: { name: string };
    };
  };
}

export interface MapboxResponse {
  features: MapboxProps[];
}

export interface MapboxSearchResponse {
  type: "FeatureCollection";
  suggestions: MapboxProps[];
  attribution: string;
}

export interface MapboxFeature {
  type: "Feature";
  id: string;
  geometry: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  properties: {
    name: string;
    mapbox_id: string;
    feature_type: string;
    place_type: string[];
    context?: MapboxContext[];
    address?: string;
    full_address?: string;
    postcode?: string;
    city?: string;
    region?: string;
    country?: string;
    country_code?: string;
    street?: string;
    street_number?: string;
    category?: string;
    maki?: string;
    poi_category?: string[];
    neighborhood?: string;
    district?: string;
  };
  matching_text?: string;
  matching_place_name?: string;
  place_name: string;
  center: [number, number]; // [longitude, latitude]
  bbox?: [number, number, number, number]; // [west, south, east, north]
  relevance: number;
  internal_id?: string;
  language?: string;
}

export interface MapboxContext {
  id: string;
  mapbox_id: string;
  text: string;
  text_en?: string;
  language_en?: string;
  wikidata?: string;
  short_code?: string;
}

export type MapType = mapboxgl.Map;
