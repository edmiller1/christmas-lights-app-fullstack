"use client";

import { useEffect } from "react";

export const UserLocation = () => {
  useEffect(() => {
    if ("geolocation" in navigator) {
      // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords;
        localStorage.setItem(
          "user_location",
          JSON.stringify({ latitude, longitude })
        );
      });
    }
  }, []);

  return null;
};
