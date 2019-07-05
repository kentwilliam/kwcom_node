// @format

const PALETTE = {
  logoBackground: "black",
  logoBackgroundHover: "#314157",
  monoBackground: "#314157",
  monoText: "#eee",
  linkText: "#9CC5FF",
  pageBackground: "#222626",
  text: "#ddd",
  textAccent: "white"
};

const CONTENT_FONT = `
  -apple-system, 
  BlinkMacSystemFont, 
  "Segoe UI", 
  Roboto, 
  Helvetica, 
  Arial, 
  sans-serif, 
  "Apple Color Emoji", 
  "Segoe UI Emoji", 
  "Segoe UI Symbol"
`;

const HEADING_FONT = `
  Baskerville, 
  Garamond,
  Georgia,
  sans-serif
`;

const MONOSPACE_FONT = `
  "SFMono-Regular",
  "Liberation Mono",
  Menlo,
  monospace
`;

const renderStyle = () => `
  body {
    font-family: ${CONTENT_FONT};
    background-color: ${PALETTE.pageBackground};
    color: ${PALETTE.text};
    font-size: 16px;
    margin: 0;
    display: grid;
    grid-template-columns: 40px 1fr minmax(12em, 36em) 1fr 40px; 
    grid-template-rows: 120px 40px auto 70px;
    align-items: stretch;
    justify-items: stretch;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  #content-background {
    grid-column-start: 2;
    grid-column-end: -2;
    grid-row-start: 3;
    grid-row-end: -2;
  }

  #logo {
    grid-column-start: 3;
    grid-column-end: 4;
    grid-row-start: 1;
    grid-row-end: 2;
  }
    #logo a {
      float: left;
      line-height: 0;
      position: relative;
      top: 50px;
    }
      #logo a img {
        height: 50px;
        width: 50px;
        border-radius: 0 50%;
        transition: .2s;
      }
        body:not(.page-home) #logo a:hover img {
          opacity: .8;
        }
        body.page-home #logo a {
          cursor: default;
        }
  
  #menu {
    display: none;
  }    

  #content {
    grid-column-start: 4;
    grid-column-end: -4;
    grid-row-start: 3;
    grid-row-end: -2;
    transition: .2s;
    padding-bottom: 3em;
    font-weight: 300;
  }

  p, blockquote, pre, li {
    max-width: 36em;
    line-height: 1.8em;
  }

  li {
    max-width: 33em;
  }

  p, li {
    margin: 1.3em 0;
  }
    p:first-of-type {
      margin: 0 0 1.3em;
    }

  pre, code {
    font-family: ${MONOSPACE_FONT};
    font-size: 14px;
    background: ${PALETTE.monoBackground};
    color: ${PALETTE.monoText}
  }
    pre {
      padding: 1.2em 1.2em 1.5em; 
      border-radius: .3em;
      margin: 2em 0;
      min-width: 36em;
      max-width: 80em;
    }
    code {
      padding: .2em .4em;
      margin: 0 .2em;
      vertical-align: baseline;
      border-radius: .4em;
    }
    pre code {
      padding: 0;
      margin: 0;
      background: none;
    }

  blockquote {
    font-family: ${HEADING_FONT};
    font-size: 110%;
  }
    blockquote p:first-of-type::before {
      content: '“';
    }
    blockquote p:last-of-type::after {
      content: '”';
    }
  
  #content img {
    max-width: 100%;
  }

  #content a {
    color: ${PALETTE.linkText};
    transition: .2s;
  }
    #content a:hover {
      box-shadow: inset 0 -1px 0 ${PALETTE.linkText};
    }

  #content h1, h2, h3 {
    margin: 0;
    line-height: inherit;
  }
    #content h1 a, #content h2 a, #content h3 a {
      font-weight: inherit;
      color: inherit;
      box-shadow: none;
    }
      #content h1 a:hover, #content h2 a:hover, #content h3 a:hover {
        color: ${PALETTE.linkText};
      }

  #content h1 {
    position: relative;
    padding: .5em 30px .6em;
    font-family: ${HEADING_FONT};
    font-size: 240%;
    font-weight: 300;
    text-align: center;
  }
  
  #content h2 {
    font-family: ${HEADING_FONT};
    font-size: 90%;
    font-weight: 500;
    letter-spacing: .05em;
    padding: 1.6em 15% 0;
    text-align: center;
    text-transform: uppercase;
    line-height: 1.8em;
  }

  #content .metadata {
    text-transform: uppercase;
    font-size: 70%;
    padding: 0 0 2.2em;
    display: block;
    color: #888;
    text-align: center;
    letter-spacing: .1em;
  }
    #content .metadata > *:not(:last-child):after {
      content: '\u00B7';
      margin: 0 .2em;
    }

  .page-home #content h1 {
    font-size: 160%;
    padding: .5em 30px .4em;
  }

  .page-home #content a h1 {
    color: ${PALETTE.text};
  }
    .page-home #content a:hover h1 {
      color: ${PALETTE.textAccent};
    }
`;

module.exports = renderStyle;
