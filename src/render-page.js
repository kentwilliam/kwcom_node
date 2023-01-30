// @format

const renderStyle = require("./render-style");

const renderPage = (pageID, content) => `
  <!doctype html>
  <html lang="en-US">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
      <title>Field notes by Kent William Innholt</title>
      <style>
        ${renderStyle()}
      </style>
      <script src="/static/client.js" async defer></script>
    </head>
    <body class="page-${pageID}">
      <nav id="header">
        <a href="/" id="logo">
          <img src="/static/byline.jpg" alt="Headshot of Kent William Innholt" />
          <h1>Field notes</h1>
        </a>
        <span class="spacer" aria-hidden></span>
        <!--<a href="/">Home</a>-->
      </nav>
      <div id="content">
        ${content}
      </div>
    </body>
  </html>
`;

module.exports = renderPage;
