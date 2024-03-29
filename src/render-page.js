// @format

const renderStyle = require("./render-style");
const siteConfig = require("./site-config");

const renderPage = (
  pageID,
  content,
  contentTitle,
  contentSummary,
  request,
  contentImage = "https://kentwilliam.com/static/byline-240.jpg",
  moreContent
) => `
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
      <meta property="og:url" content="https://kentwilliam.com${request.url}" />
      <meta property="og:image" content="https://kentwilliam.com/static/byline-large.png" />
      <meta property="og:image:secure_url" content="https://kentwilliam.com/static/byline-large.png" />
      <meta property="og:description" content="${contentSummary}" />
      <meta property="og:site_name" content="${siteConfig.title}" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@oerhoert" />
      <meta name="twitter:creator" content="@oerhoert" />
      <meta name="twitter:title" content="${contentTitle}" />
      <meta name="twitter:description" content="${contentSummary}" />
      <meta name="twitter:image" content="https://kentwilliam.com/static/byline-large.png" />

      <script defer data-domain="kentwilliam.com" src="https://plausible.io/js/script.js"></script>
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
      ${
        moreContent != null
          ? `
          <aside id="more-content">
            ${moreContent}
          </aside>`
          : ""
      }
    </body>
  </html>
`;

module.exports = renderPage;
