export type GeoEntity = {
  id: string;
  name: string;
  flag?: string;
  type: 'country' | 'city' | 'hotel';
};
