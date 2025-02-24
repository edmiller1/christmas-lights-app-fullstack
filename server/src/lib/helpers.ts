export const getLocationData = async (addressId: string) => {
  try {
    console.log("Fetching location data for addressId:", addressId);

    const response = await fetch(
      `https://api.mapbox.com/search/searchbox/v1/retrieve/${addressId}?session_token=0f6c0283-69eb-41d1-88af-83b6da40a6a0&access_token=${process.env.MAPBOX_API_KEY}`
    );

    console.log("Mapbox API response status:", response.status);

    if (!response.ok) {
      throw new Error(
        `Mapbox API error: ${response.status} ${response.statusText}`
      );
    }

    const jsonData = await response.json();
    console.log("Mapbox API response data:", JSON.stringify(jsonData, null, 2));

    if (!jsonData || !jsonData.features || !jsonData.features[0]) {
      throw new Error("No valid location data in response");
    }

    const data = jsonData.features[0];

    // Add null checks for each property access
    if (
      !data.properties?.coordinates?.latitude ||
      !data.properties?.coordinates?.longitude ||
      !data.properties?.context?.country?.name ||
      !data.properties?.context?.region?.name ||
      !data.properties?.context?.place?.name
    ) {
      throw new Error("Missing required location properties in response");
    }

    const locationData = {
      latitude: data.properties.coordinates.latitude,
      longitude: data.properties.coordinates.longitude,
      country: data.properties.context.country.name,
      region: data.properties.context.region.name,
      city: data.properties.context.place.name,
    };

    console.log("Processed location data:", locationData);
    return locationData;
  } catch (error) {
    console.error("Error in getLocationData:", error);
    console.error("Full error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
};

export const getOptimizedImageUrls = (publicId: string) => {
  const baseUrl = "https://res.cloudinary.com/drlwnmkq9/image/upload";

  return {
    url: `${baseUrl}/q_auto,f_auto/${publicId}`,

    responsive: {
      sm: `${baseUrl}/c_fill,w_640,q_auto,f_auto/${publicId}`,
      md: `${baseUrl}/c_fill,w_1024,q_auto,f_auto/${publicId}`,
      lg: `${baseUrl}/c_fill,w_1920,q_auto,f_auto/${publicId}`,
    },
  };
};
