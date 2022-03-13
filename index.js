// @format

const fs = require("fs");
const http = require("http");
const marked = require("marked");
const memory_cache = require('memory-cache');
const path = require("path");
const renderPage = require("./src/render-page");

// Alphas, numbers, slash, and dash, plus an optional three-letter extension
const VALID_ROUTE = /^[a-zA-Z\d/-]+(\.[a-z]{3})?$/;

const ONE_MINUTE = 60 * 1000; /* ms */

const CACHE_TIMEOUT = ONE_MINUTE;

const server = (request, response) => {
  if (request.method !== "GET") {
    response.statusCode = 501;
    response.setHeader("Content-Type", "text/plain");
    response.end("Method not implemented");
    return;
  }
  
  response.setHeader('Cache-control', 'public, max-age=300');

  const isValidRoute = VALID_ROUTE.test(request.url);
  if (!isValidRoute) {
    renderNotFound(response);
    return;
  }

  const cachedContent = memory_cache.get(request.url);
  if (cachedContent != null) {
    send(response, cachedContent);
    return;
  }

  const route = ROUTES.find(route => route.match(request.url));
  if (route == null) {
    renderNotFound(response);
    return;
  }

  route.render(response, request);
};

const readMarkdownFile = filePath =>
  new Promise((resolve, reject) => {
    fs.readFile(filePath, { encoding: "utf-8" }, (error, markdown) =>
      error ? reject([filePath, error]) : resolve([filePath, markdown])
    );
  });

const renderHome = (response, request) => {
  fs.readdir("static/articles", (error, files) => {
    if (error) {
      console.log({ error });
      renderError(response);
      return;
    }

    const fileNames = files
      .filter(file => file.endsWith(".md"))
      .map(file => `static/articles/${file}`);

    const filesContent = Promise.all(
      fileNames.map(file => readMarkdownFile(file))
    )
      .then(articles => {
        const pageContent = renderPage(
          "home",
          articles
            .map(([filePath, markdown]) => new Article(filePath, markdown))
            .filter(article => new Date(article.published).getFullYear() > 2020)
            .sort((a, b) => (a.published > b.published ? -1 : 1))
            .map(
              article => `
              <article>
                <a href="${article.url}">
                  <h1>${article.title}</h1>
                  <div class="metadata">
                    <time datetime=${article.published}>
                      ${article.publishedString}
                    </time>
                  </div>
                </a>
              </article>
            `
            )
            .join("")
        );

        memory_cache.put(request.url, pageContent, CACHE_TIMEOUT);

        send(response, pageContent, 200);
      })
      .catch(error => console.log({error})  || renderError(response));
  });
};

class Article {
  constructor(filePath, markdown) {
    const [title, published] = markdown
      .split("\n")
      .slice(0, 4)
      .map(item => item.replace(/^[^:]+:\s?/, ""));

    // Text starts after the first ~ sign
    const text = marked.parse(markdown.replace(/^[^~]+/, "").slice(1));

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
    this.published = published;
    this.publishedString = publishedString;
    this.text = text;
    this.title = title;
    this.readTimeInMinutes = readTimeInMinutes;
  }
}

const renderArticle = (response, request) => {
  const filePath = `static${request.url}.md`;

  fs.readFile(filePath, { encoding: "utf-8" }, (error, markdown) => {
    if (error) {
      console.log({ error });
      renderNotFound(response);
      return;
    }

    const article = new Article(filePath, markdown);

    const pageContent = renderPage(
      "article",
      `
        <h1>${article.title}</h1>
        <div class="metadata">
          <time datetime=${article.published}>${article.publishedString}</time>
          <span>${article.readTimeInMinutes} min read</span>
        </div>
        ${article.text}
      `
    );

        memory_cache.put(request.url, pageContent, CACHE_TIMEOUT);

    send(response, pageContent, 200);
  });
};

const renderNotFound = response =>
  send(response, renderPage("not-found", "Not found"), 404);

const renderError = response =>
  send(response, renderPage("error", "Server error"), 500);

const MIME_TYPES = {
  png: "image/png",
  jpg: "image/jpg",
  gif: "image/gif"
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

const createRoute = config => {
  const regex = new RegExp("^" + config.path.replace(/:[\w\d]+/, "(.*)") + "$");

  return { ...config, match: path => regex.test(path) };
};

const ROUTES = [
  createRoute({ path: "/", render: renderHome }),
  createRoute({ path: "/articles/:slug", render: renderArticle }),
  createRoute({ path: "/404", render: renderNotFound }),
  createRoute({ path: "/static/:file", render: renderStatic })
];

const send = (response, content, statusCode = 200) => {
  response.writeHead(statusCode, { "Content-Type": "text/html" });
  response.end(content, "utf-8");
};

http.createServer(server).listen(8125);

console.log("Server running at http://localhost:8125/");
