export const createRequest = (token: string, method: string = "GET") => {
  return {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
};
