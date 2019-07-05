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
      <div id="headshot"></div>
      <nav id="menu">
        <a href=""><strong>B</strong><span>log</span></a>
        <a href=""><strong>R</strong><span>eviews</span></a>
        <a href=""><strong>A</strong><span>rchive</span></a>
      </nav>
      <div id="content">
        ${content}
      </div>
    </body>
  </html>
`;

module.exports = renderPage;
