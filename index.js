// @format

const fs = require("fs");
const http = require("http");
const marked = require("marked");
const path = require("path");
const renderPage = require("./src/render-page");

const VALID_ROUTE = /^[a-zA-Z\d/-]+$/;

const server = (request, response) => {
  if (request.method !== "GET") {
    response.statusCode = 501;
    response.setHeader("Content-Type", "text/plain");
    response.end("Method not implemented");
    return;
  }

  const isValidRoute = VALID_ROUTE.test(request.url);
  if (!isValidRoute) {
    renderNotFound(response);
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

const renderHome = response => {
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
        send(
          response,
          renderPage(
            "home",
            articles
              .map(([filePath, markdown]) => new Article(filePath, markdown))
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
          )
        );
      })
      .catch(error => renderError(response));
  });
};

class Article {
  constructor(filePath, markdown) {
    const [title, published] = markdown
      .split("\n")
      .slice(0, 4)
      .map(item => item.replace(/^[^:]+:\s?/, ""));

    // Text starts after the first ~ sign
    const text = marked(markdown.replace(/^[^~]+/, "").slice(1));

    // Current-year dates show without year, others show with year
    const publishedDate = new Date(published);
    const currentYear = new Date().getFullYear();
    const year =
      currentYear === publishedDate.getFullYear()
        ? ""
        : ", " + publishedDate.getFullYear();
    const publishedString = `
      ${publishedDate.toLocaleString("en-us", { month: "long" })} 
      ${publishedDate.getDay()}${year}
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
      renderError(response);
      return;
    }

    const article = new Article(filePath, markdown);

    const content = renderPage(
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

    send(response, content, 200);
  });
};

const renderNotFound = response =>
  send(response, renderPage("not-found", "Not found"), 404);

const renderError = response =>
  send(response, renderPage("error", "Server error"), 500);

const renderStatic = (response, request) => {
  send(response, "test", 200);
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

console.log("Server running at http://127.0.0.1:8125/");
