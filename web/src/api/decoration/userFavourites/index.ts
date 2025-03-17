import privateAxios from "@/lib/axios";
import { Decoration } from "@/lib/types";

interface UserFavouritesResponse {
  favourites: Decoration[];
  error?: string;
}

export const getUserFavourites = async () => {
  const response = await privateAxios.get<UserFavouritesResponse>(
    "/api/decoration/userFavourites"
  );

  if (response.status !== 200) {
    throw new Error(response.data.error);
  }

  return response.data.favourites;
};
