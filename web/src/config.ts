const config = {
  appName: "Christmas Lights App",
  appDescription: "Create and explore amazing Christmas decorations.",
  domainName:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://christmaslightsapp.com",
};

export default config;
