// @format

const renderStyle = require("./render-style");

const renderPage = (pageID, content) => `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8">
      <title></title>
      <link href="https://fonts.googleapis.com/css?family=Heebo:100,300,700" rel="stylesheet">
      <style>
        ${renderStyle()}
      </style>
    </head>
    <body class="page-${pageID}">
      <h1 id="logo">
        ${pageID !== "home" ? '<a href="/">' : ""}
          Kent William Innholt
          <span>Field Notes</span>
        ${pageID !== "home" ? "</a>" : ""}
      </h1>
      ${content}
    </body>
  </html>
`;

module.exports = renderPage;
