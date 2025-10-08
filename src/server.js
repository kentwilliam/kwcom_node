import fs from "fs";
import stream from "stream";
import * as marked from "marked";
import memory_cache from "memory-cache";
import path from "path";
import renderPage from "./render-page.js";
import config from "./config.js";

// Alphas, numbers, slash, and dash, plus an optional extension
const VALID_ROUTE =
  /^[a-zA-Z\d/-]+(\.[a-z0-9]{2,10})?(\?[a-zA-Z\d/-]+)?(#[a-zA-Z\d/-]+)?$/;

const server = (request, response) => {
  print("Request: ", request.url);

  if (request.method !== "GET") {
    respond({
      response,
      request,
      content: "Method not implemented",
      contentType: "text/plain",
      statusCode: 501,
    });
    return;
  }

  response.setHeader("Cache-control", "public, max-age=300");

  const isValidRoute = VALID_ROUTE.test(request.url);
  if (!isValidRoute) {
    print("Invalid route");
    renderNotFound(response, request);
    return;
  }

  const { content, contentType, headers } = memory_cache.get(request.url) ?? {};
  if (content != null) {
    print("returing cached response", content.length);
    respond({
      response,
      request,
      content,
      contentType,
      headers,
    });
    return;
  } else {
    print("generating new response");
  }

  const route = ROUTES.find((route) => route.match(getBasePath(request.url)));
  if (route == null) {
    print("Not found");
    renderNotFound(response, request);
    return;
  }

  route.render(response, request);
};

const getBasePath = (path) => {
  const queryParameterIndex = path.indexOf("?") || path.indexOf("#");

  return queryParameterIndex !== -1 ? path.slice(0, queryParameterIndex) : path;
};

const readMarkdownFile = (filePath) =>
  new Promise((resolve, reject) => {
    fs.readFile(filePath, { encoding: "utf-8" }, (error, markdown) =>
      error ? reject([filePath, error]) : resolve([filePath, markdown])
    );
  });

const getAllNotes = (response, request) =>
  new Promise((resolve) =>
    fs.readdir("static/notes", (error, files) => {
      if (error) {
        print({ error });
        renderError(response, request);
        return;
      }

      const fileNames = files
        .filter((file) => file.endsWith(".md"))
        .map((file) => `static/notes/${file}`);

      Promise.all(fileNames.map((file) => readMarkdownFile(file)))
        .catch((error) => print({ error }) || renderError(response, request))
        .then(resolve);
    })
  );

const renderHome = (response, request) => {
  const socials = [
    ["Email", "mailto:kentwilliam@gmail.com", "kentwilliam@gmail.com"],
    ["Threads", "https://www.threads.com/@kentwilliam", "@kentwilliam"],
    ["X", "https://x.com/oerhoert", "@oerhoert"],
    ["GitHub", "https://github.com/kentwilliam", "kentwilliam"],
    ["CodePen", "https://codepen.io/kentwilliam", "kentwilliam"],
  ];

  const bio = `
    <div id="bio">
      <img id="headshot" src="/static/headshot-big.jpg" width=200 height=267 alt="Photo of Kent William Innholt">
      <p>Hi there! 👋 I'm Kent William.</p>
      <p>I'm a design engineer who loves building things that matter.</p>
      <p>At Meta, I started and led a data table framework that's now powering over 12,000 UIs across the company.</p>
      <p>I've also worked on dev tools, no-code mobile platforms, ad blocker defense, games, and VR UI systems.</p>
      <p>Currently, I'm in builder mode, validating ideas and exploring early-stage opportunities.</p>
      <ul id="socials">
        ${socials
          .map(
            ([label, href, handle]) => `
              <li class="${label.toLowerCase()}">
                <a href="${href}">
                  <span>${label}</span>
                  ${handle}
                </a>
              </li>
            `
          )
          .join("")}
      </ul>
    </div>
  `;

  getAllNotes(response).then((notes) => {
    respond({
      request,
      content: renderPage(
        "root",
        `${bio}
        <nav id="sections">
          <h2>Posts</h2>
          ${renderNotes(notes)}
        </nav>`,
        "Home",
        "",
        request
      ),
      response,
    });
  });
};

const renderNotes = (notes) => `
  <ol>
    ${notes
      .map(([filePath, markdown]) => new Note(filePath, markdown))
      .sort((a, b) => (a.published > b.published ? -1 : 1))
      .map(
        (note) => `
        <li class="note">
          <a href="${note.path}">
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

    // Pick first paragraph, strip all HTML
    const summaryIndex = text.indexOf("</p>");
    const summary =
      summaryIndex === -1
        ? ""
        : text.slice(3, summaryIndex).replace(/(<([^>]+)>)/gi, "");

    // Current-year dates show without year, others show with year
    const publishedDate = new Date(published);
    const publishedString = `
      ${publishedDate.toLocaleString("en-us", { month: "short" })} 
      ${publishedDate.getDate()}, ${publishedDate.getFullYear()}
    `;

    const wordsPerMinute = 180;
    const readTimeInMinutes = Math.max(
      1,
      Math.floor(text.split(" ").length / wordsPerMinute)
    );

    const path = filePath.replace(/^static/, "").replace(/\.md$/, "");

    this.path = path;
    this.published = published;
    this.publishedString = publishedString;
    this.readTimeInMinutes = readTimeInMinutes;
    this.summary = summary;
    this.text = text;
    this.title = title;
  }
}

const renderNote = (response, request) => {
  const filePath = `static${getBasePath(request.url)}.md`;

  fs.readFile(filePath, { encoding: "utf-8" }, (error, markdown) => {
    if (error) {
      print({ error });
      renderNotFound(response, request);
      return;
    }

    const note = new Note(filePath, markdown);

    const pageContent = renderPage(
      "note",
      `
        <h1>${note.title}</h1>
        <div class="metadata">
          <span><img src="/static/byline.jpg" class="byline" height=32 width=32> Kent William Innholt</span>
          <time datetime=${note.published}>${note.publishedString}</time>
          <span>${note.readTimeInMinutes} min read</span>
        </div>
        ${note.text}
      `,
      note.title,
      note.summary,
      request,
      null
    );

    respond({
      request,
      content: pageContent,
      response,
    });
  });
};

const redirectArticle = (response, request) => {
  const path = getBasePath(request.url);
  const newPath = path.replace(/^\/articles/, "/notes");
  if (path.length === newPath.length) {
    return renderError(response, request);
  }
  response.writeHead(301, { Location: newPath });
  response.end();
};

const renderNotFound = (response, request) =>
  respond({
    cacheResponse: false,
    content: renderPage(
      "not-found",
      "Not found",
      "Not found",
      "We were unable to locate a page at this address",
      request
    ),
    request,
    response,
    statusCode: 404,
  });

const renderError = (response, request) =>
  respond({
    cacheResponse: false,
    content: renderPage(
      "error",
      "Server error",
      "Server error",
      "Oops! Something went wrong",
      request
    ),
    request,
    response,
    statusCode: 500,
  });

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
  const requestPath = getBasePath(request.url.toString()).replace(
    "/static",
    ""
  );

  if (requestPath.endsWith("/") || requestPath.includes("..")) {
    renderError(response, request);
    return;
  }

  const directory = process.env.PWD;
  const file = path.join(directory, "static", "resources", requestPath);
  const extension = path.extname(file).slice(1);
  const contentType = MIME_TYPES[extension];

  if (contentType == null) {
    renderError(response, request);
    return;
  }

  const stream = fs.createReadStream(file);

  stream.on("open", () => {
    response.setHeader("Content-Type", contentType);
    stream.pipe(response);
  });

  stream.on("error", () => renderError(response, request));
};

const createRoute = (config) => {
  const regex = new RegExp("^" + config.path.replace(/:[\w\d]+/, "(.*)") + "$");

  return { ...config, match: (path) => regex.test(path) };
};

const renderRSS = (response, request) =>
  getAllNotes(response).then((notes) => {
    const host =
      request.connection.encrypted == null
        ? config.server.localhost
        : "https://" + request.connection.host;

    const pageContent = `<?xml version="1.0" encoding="UTF-8" ?>
      <rss version="2.0">
        <channel>
          <title>${config.site.title}</title>
          <description>${config.site.description}</description>
          <link>${host}/feed</link>
          <copyright>${new Date().getFullYear()} kentwilliam.com All rights reserved</copyright>
          <ttl>1800</ttl>
          ${notes
            .map(([filePath, markdown]) => new Note(filePath, markdown))
            .sort((a, b) => (a.published > b.published ? -1 : 1))
            .map(
              (note) => `
                <item>
                  <title>${note.title.replace(/&/g, "&amp;")}</title>
                  <description><![CDATA[${note.summary}]]></description>
                  <link>${host + note.path}</link>
                  <guid>${host + note.path}</guid>
                  <pubDate>${new Date(note.published).toUTCString()}</pubDate>
                </item>
              `
            )
            .join("")}
        </channel>
      </rss>`;

    respond({
      content: pageContent,
      contentType: "application/rss+xml",
      request,
      response,
    });
  });

//<lastBuildDate>Mon, 6 Sep 2010 00:01:00 +0000</lastBuildDate>
//<pubDate>Sun, 6 Sep 2009 16:20:00 +0000</pubDate>

const print = (...args) => {
  console.log(...args);
};

const proxyPlausibleJS = async (response, request) => {
  try {
    const script = await fetch("https://plausible.io/js/script.js");

    if (!script.ok) {
      print({ error: script.errors });
      renderError(response, request);
    }

    const readableStream = stream.Readable.fromWeb(script.body);
    readableStream.on("error", (error) => {
      print({ error });
      renderError(response, request);
    });

    const content = await streamToString(readableStream);

    respond({
      content,
      contentType: MIME_TYPES.js,
      response,
      request,
      headers: script.headers,
    });
  } catch (error) {
    print({ error });
    renderError(response, request);
  }
};

function streamToString(stream) {
  const chunks = [];

  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on("error", (error) => reject(error));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
}

const ROUTES = [
  createRoute({ path: "/", render: renderHome }),
  createRoute({ path: "/log.js", render: proxyPlausibleJS }),
  createRoute({ path: "/articles.rss", render: renderRSS }),
  createRoute({ path: "/feed", render: renderRSS }),
  createRoute({ path: "/notes/:slug", render: renderNote }),
  createRoute({ path: "/articles/:slug", render: redirectArticle }),
  createRoute({ path: "/404", render: renderNotFound }),
  createRoute({ path: "/static/:file", render: renderStatic }),
];

const respond = ({
  cacheResponse = false,
  content,
  contentType = "text/html",
  response,
  request,
  statusCode = 200,
  headers = [],
}) => {
  if (cacheResponse) {
    print("storing to cache");
    memory_cache.put(
      request.url,
      { content, contentType, headers },
      config.cache.timeout
    );
  }

  for (const [header, value] of headers) {
    response.setHeader(header, value);
  }
  response.writeHead(statusCode, { "Content-Type": contentType });
  response.end(content);
};

export default server;
