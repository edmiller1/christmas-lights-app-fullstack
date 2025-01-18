export const createAuthRequest = (c: any) => {
  return new Request(c.req.url, {
    method: c.req.method,
    headers: new Headers(c.req.raw.headers),
    body: c.req.body,
  });
};
