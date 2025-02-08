export const getLocationData = async (addressId: string) => {
  const response = await fetch(
    `https://api.mapbox.com/search/searchbox/v1/retrieve/${addressId}?session_token=0f6c0283-69eb-41d1-88af-83b6da40a6a0&access_token=${process.env.MAPBOX_API_KEY}`
  );

  const jsonData = await response.json();
  const data = jsonData.features[0];

  const latitude = data?.properties.coordinates.latitude as number;
  const longitude = data?.properties.coordinates.longitude as number;
  const country = data?.properties.context.country.name as string;
  const region = data?.properties.context.region.name as string;
  const city = data?.properties.context.place.name as string;

  return {
    latitude,
    longitude,
    country,
    region,
    city,
  };
};
