// @format

const renderStyle = require("./render-style");

const renderPage = (pageID, content) => `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8">
      <title></title>
      <style>
        ${renderStyle()}
      </style>
    </head>
    <body class="page-${pageID}">
      <div id="content-background"></div>
      <h1 id="logo"><a href="/"><img src="/static/byline.jpg" /></a></h1>
      <div id="content">
        ${content}
      </div>
    </body>
  </html>
`;

module.exports = renderPage;
