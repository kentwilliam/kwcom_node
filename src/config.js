// @format

const PORT = process.env.PORT || 3000;

const CONFIG = {
  site: {
    description: "Kent William Innholt's corner of the Internet",
    title: "code, design, heart",
  },
  cache: {
    timeout: 10 * 1000,
  },
  server: {
    port: PORT,
    localhost: `http://localhost:${PORT}`,
  },
};

export default CONFIG;
