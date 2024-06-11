export interface LocationModalProps {
  visible: boolean;
  onClose: () => void;
  onLocationConfirm: (data: any) => void;
}

export interface GeocodingResponse {
  results: GeocodingResult[];
  status: string;
}

export interface GeocodingResult {
  address_components: AddressComponent[];
  formatted_address: string;
  geometry: Geometry;
  place_id: string;
  plus_code: PlusCode;
  types: string[];
}

export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface Geometry {
  location: Location;
  location_type: string;
  viewport: Viewport;
}

export interface Location {
  lat: number;
  lng: number;
}

export interface Viewport {
  northeast: Location;
  southwest: Location;
}

export interface PlusCode {
  compound_code: string;
  global_code: string;
}

export interface MapComponentModel {
  [key: string]: string[];
}
