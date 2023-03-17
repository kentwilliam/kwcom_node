// @format

const renderStyle = require("./render-style");
const siteConfig = require("./site-config");

const renderPage = (pageID, content, contentTitle, contentSummary, request) => `
  <!doctype html>
  <html lang="en-US">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
      <title>${siteConfig.title}</title>
      <style>
        ${renderStyle()}
      </style>
      <script src="/static/client.js" async defer></script>

      <!-- -->
      <link rel="apple-touch-icon" sizes="180x180" href="/static/icons/apple-touch-icon.png">
      <link rel="icon" type="image/png" sizes="32x32" href="/static/icons/favicon-32x32.png">
      <link rel="icon" type="image/png" sizes="16x16" href="/static/icons/favicon-16x16.png">
      <link rel="manifest" href="/static/icons/site.webmanifest">
      <link rel="mask-icon" href="/static/icons/safari-pinned-tab.svg" color="#5bbad5">
      <link rel="shortcut icon" href="/static/icons/favicon.ico">
      <meta name="msapplication-TileColor" content="#da532c">
      <meta name="msapplication-config" content="/static/icons/browserconfig.xml">
      <meta name="theme-color" content="#ffffff">

      <!-- -->
      <meta name="description" content="${contentSummary}" />
      <meta property="og:title" content="${contentTitle}" />
      <meta property="og:type" content="article" />
      <meta property="og:url" content="${request.url}" />
      <meta property="og:image" content="https://kentwilliam.com/static/byline-240.jpg" />
      <meta property="og:image:secure_url" content="https://kentwilliam.com/static/byline-240.jpg" />
      <meta property="og:description" content="${contentSummary}" />
      <meta property="og:site_name" content="${siteConfig.title}" />
    </head>
    <body class="page-${pageID}">
      <nav id="header">
        <a href="/" id="logo">
          <img src="/static/byline.jpg" alt="Headshot of Kent William Innholt" />
          <h1>Field notes</h1>
        </a>
        <span class="spacer" aria-hidden="true"></span>
        <!--<a href="/">Home</a>-->
      </nav>
      <div id="content">
        ${content}
      </div>
    </body>
  </html>
`;

module.exports = renderPage;
