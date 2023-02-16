const fs = require("fs");
const http = require("http");
const marked = require("marked");
const memory_cache = require("memory-cache");
const path = require("path");
const renderPage = require("./src/render-page");

// Alphas, numbers, slash, and dash, plus an optional extension
const VALID_ROUTE = /^[a-zA-Z\d/-]+(\.[a-z0-9]{2,5})?$/;

const ONE_MINUTE = 60 * 1000; /* ms */

const CACHE_TIMEOUT = ONE_MINUTE;

const server = (request, response) => {
  console.log("Creating server");

  if (request.method !== "GET") {
    response.statusCode = 501;
    response.setHeader("Content-Type", "text/plain");
    response.end("Method not implemented");
    return;
  }

  response.setHeader("Cache-control", "public, max-age=300");

  const isValidRoute = VALID_ROUTE.test(request.url);
  if (!isValidRoute) {
    console.log("Invalid route");
    renderNotFound(response);
    return;
  }

  const cachedContent = memory_cache.get(request.url);
  if (cachedContent != null) {
    send(response, cachedContent);
    return;
  }

  const route = ROUTES.find((route) => route.match(request.url));
  if (route == null) {
    console.log("Not found");
    renderNotFound(response);
    return;
  }

  route.render(response, request);
};

const readMarkdownFile = (filePath) =>
  new Promise((resolve, reject) => {
    fs.readFile(filePath, { encoding: "utf-8" }, (error, markdown) =>
      error ? reject([filePath, error]) : resolve([filePath, markdown])
    );
  });

const renderArchive = (response, request) =>
  renderHome(response, request, true);

const getAllNotes = (response) =>
  new Promise((resolve) =>
    fs.readdir("static/notes", (error, files) => {
      if (error) {
        console.log({ error });
        renderError(response);
        return;
      }

      const fileNames = files
        .filter((file) => file.endsWith(".md"))
        .map((file) => `static/notes/${file}`);

      Promise.all(fileNames.map((file) => readMarkdownFile(file)))
        .catch((error) => console.log({ error }) || renderError(response))
        .then(resolve);
    })
  );

const renderHome = (response, request, isArchive = false) =>
  getAllNotes(response).then((notes) => {
    const enabledSections = {
      Archive: (note) => new Date(note.published).getFullYear() < 2022,
      Notes: (note) => new Date(note.published).getFullYear() >= 2022,
    };

    const sections = `
      <nav id="sections">
        ${(isArchive
          ? ["Archive"]
          : ["Notes", "Reading", "Playing", "Listening to", "Work"]
        )
          .map(
            (section) =>
              `<h2 class="${
                enabledSections[section] == null ? "disabled" : ""
              }">${section}</h2>${
                enabledSections[section] != null
                  ? renderNotes(notes, enabledSections[section], section)
                  : ""
              }`
          )
          .join("")}
      </nav>
    `;

    const pageContent = renderPage("root", sections);

    memory_cache.put(request.url, pageContent, CACHE_TIMEOUT);

    send(response, pageContent, 200);
  });

const renderNotes = (notes, filter, section) => `
  <ol>
    ${notes
      .map(([filePath, markdown]) => new Note(filePath, markdown))
      .filter(filter)
      .sort((a, b) => (a.published > b.published ? -1 : 1))
      .map(
        (note) => `
        <li class="note">
          <a href="${note.url}">
            ${note.title}
          </a>
          <div class="metadata">
            <time datetime="${note.published}">${note.publishedString}</time>
            <span>${note.readTimeInMinutes} min read</span>
          </div>
        </li>
      `
      )
      .join("")}
    ${
      section === "Notes"
        ? `
          <li class="note">
            <a href="/archive" id="archive">Archive \u00bb</a>
            <div class="metadata">
              2014\u20132021 
            </div>
          </li>
          `
        : ""
    }
  </ol>
`;

class Note {
  constructor(filePath, markdown) {
    const [title, published] = markdown
      .split("\n")
      .slice(0, 4)
      .map((item) => item.replace(/^[^:]+:\s?/, ""));

    // Text starts after the first ~ sign
    const rawText = markdown.replace(/^[^~]+/, "").slice(1);
    // Use XHTML to ensure RSS compatible markup
    const text = marked.parse(rawText, { xhtml: true });

    // Current-year dates show without year, others show with year
    const publishedDate = new Date(published);
    const currentYear = new Date().getFullYear();
    const year =
      currentYear === publishedDate.getFullYear()
        ? ""
        : ", " + publishedDate.getFullYear();
    const publishedString = `
      ${publishedDate.toLocaleString("en-us", { month: "long" })} 
      ${publishedDate.getDate()}${year}
    `;

    const wordsPerMinute = 180;
    const readTimeInMinutes = Math.max(
      1,
      Math.floor(text.split(" ").length / wordsPerMinute)
    );

    this.url = filePath.replace(/^static/, "").replace(/\.md$/, "");
    this.fullURL = "https://kentwilliam.com/" + this.url;
    this.published = published;
    this.publishedString = publishedString;
    this.text = text;
    this.title = title;
    this.readTimeInMinutes = readTimeInMinutes;
  }
}

const renderNote = (response, request) => {
  const filePath = `static${request.url}.md`;

  fs.readFile(filePath, { encoding: "utf-8" }, (error, markdown) => {
    if (error) {
      console.log({ error });
      renderNotFound(response);
      return;
    }

    const note = new Note(filePath, markdown);

    const pageContent = renderPage(
      "note",
      `
        <h1>${note.title}</h1>
        <div class="metadata">
          <time datetime=${note.published}>${note.publishedString}</time>
          <span>${note.readTimeInMinutes} min read</span>
        </div>
        ${note.text}
      `
    );

    memory_cache.put(request.url, pageContent, CACHE_TIMEOUT);

    send(response, pageContent, 200);
  });
};

const renderNotFound = (response) =>
  send(response, renderPage("not-found", "Not found"), 404);

const renderError = (response) =>
  send(response, renderPage("error", "Server error"), 500);

const MIME_TYPES = {
  gif: "image/gif",
  ico: "image/vnd.microsoft.icon",
  jpg: "image/jpg",
  js: "text/javascript",
  png: "image/png",
  svg: "image/svg+xml",
  webmanifest: "application/manifest+json",
  woff2: "font/woff2",
  xml: "application/xml",
};

const renderStatic = (response, request) => {
  const requestPath = request.url
    .toString()
    .split("?")[0]
    .replace("/static", "");

  if (requestPath.endsWith("/") || requestPath.includes("..")) {
    renderError(response);
    return;
  }

  const directory = process.env.PWD;
  const file = path.join(directory, "static", "resources", requestPath);
  const mimeType = MIME_TYPES[path.extname(file).slice(1)];

  if (mimeType == null) {
    renderError(response);
    return;
  }

  const stream = fs.createReadStream(file);
  stream.on("open", () => {
    response.setHeader("Content-Type", mimeType);
    stream.pipe(response);
  });
  stream.on("error", () => renderError(response));
};

const createRoute = (config) => {
  const regex = new RegExp("^" + config.path.replace(/:[\w\d]+/, "(.*)") + "$");

  return { ...config, match: (path) => regex.test(path) };
};

const renderRSS = (response, request) =>
  getAllNotes(response).then((notes) => {
    const pageContent = `<?xml version="1.0" encoding="UTF-8" ?>
      <rss version="2.0">
        <channel>
          <title>Field notes by Kent William Innholt</title>
          <description>Design, code, videogames, pain, and beauty. He/him.</description>
          <link>https://www.kentwilliam.com</link>
          <copyright>${new Date().getFullYear()} kentwilliam.com All rights reserved</copyright>
          <ttl>1800</ttl>
          ${notes
            .map(([filePath, markdown]) => new Note(filePath, markdown))
            .map(
              (note) => `
                <item>
                  <title>${note.title.replace(/&/g, "&amp;")}</title>
                  <description><![CDATA[${note.text}]]></description>
                  <link>${note.fullURL}</link>
                  <guid>${note.fullURL}</guid>
                  <pubDate>${new Date(note.published).toUTCString()}</pubDate>
                </item>
              `
            )
            .join("")}
        </channel>
      </rss>`;

    //memory_cache.put(request.url, pageContent, CACHE_TIMEOUT);

    response.writeHead(200, { "Content-Type": "application/rss+xml" });
    response.end(pageContent);
  });

//<description></description>
//<lastBuildDate>Mon, 6 Sep 2010 00:01:00 +0000</lastBuildDate>
//<pubDate>Sun, 6 Sep 2009 16:20:00 +0000</pubDate>

const ROUTES = [
  createRoute({ path: "/", render: renderHome }),
  //createRoute({ path: "/articles.rss", render: renderRSS }),
  //createRoute({ path: "/feed", render: renderRSS }),
  createRoute({ path: "/archive", render: renderArchive }),
  createRoute({ path: "/notes/:slug", render: renderNote }),
  createRoute({ path: "/404", render: renderNotFound }),
  createRoute({ path: "/static/:file", render: renderStatic }),
];

const send = (response, content, statusCode = 200) => {
  response.writeHead(statusCode, { "Content-Type": "text/html" });
  response.end(content);
};

http.createServer(server).listen(8125);

console.log("Server running at http://localhost:8125/");
