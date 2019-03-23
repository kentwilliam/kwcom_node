// @format

const http = require("http");
const fs = require("fs");
const path = require("path");
const marked = require("marked");

const renderPage = require("./src/render-page");

const server = (request, response) => {
  const ROUTES = [
    createRoute({ path: "/", render: renderHome }),
    createRoute({ path: "/articles/:slug", render: renderArticle }),
    createRoute({ path: "/404", render: renderNotFound })
  ];

  const isValidRoute = /^[\w\d/-]+$/.test(request.url);
  if (!isValidRoute) {
    renderNotFound();
  }

  const route = ROUTES.find(route => route.match(request.url));
  if (route == null) {
    renderNotFound();
  }

  route.render(response, request);
};

const createRoute = config => {
  const regex = new RegExp("^" + config.path.replace(/:[\w\d]+/, "(.*)") + "$");

  return { ...config, match: path => regex.test(path) };
};

const renderHome = response => {
  fs.readdir("static/articles", (error, files) => {
    if (error) {
      console.log({ error });
      renderError(response);
      return;
    }

    const fileNames = files
      .filter(file => file.endsWith(".md"))
      .map(file => file.replace(".md", ""));

    send(
      response,
      renderPage(
        "home",
        `${fileNames.map(
          fileName => `<p><a href="/articles/${fileName}">${fileName}</a></p>`
        )}`
      )
    );
  });
};

const renderArticle = (response, request) => {
  const filePath = `static${request.url}.md`;

  fs.readFile(filePath, { encoding: "utf-8" }, (error, markdown) => {
    if (error) {
      console.log({ error });
      renderError(response);
      return;
    }

    const metadata = markdown.split("\n").slice(0, 3);

    const content = renderPage(
      "article",
      marked(markdown.replace(/^[^#]+/, ""))
    );

    send(response, content, 200);
  });
};

const renderNotFound = response =>
  send(response, renderPage("not-found", "Not found"), 404);

const renderError = response =>
  send(response, renderPage("error", "Server error"), 500);

const send = (response, content, statusCode = 200) => {
  response.writeHead(statusCode, { "Content-Type": "text/html" });
  response.end(content, "utf-8");
};

http.createServer(server).listen(8125);

console.log("Server running at http://127.0.0.1:8125/");
