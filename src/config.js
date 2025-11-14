// @format

const PORT = process.env.PORT || 3000;

const CONFIG = {
  site: {
    description: "Kent William Innholt's corner of the Internet",
    title: "code, design, heart",
  },
  cache: {
    timeout: 5 * 60 * 1000, // 5 minutes
  },
  server: {
    port: PORT,
    localhost: `http://localhost:${PORT}`,
  },
};

export default CONFIG;
