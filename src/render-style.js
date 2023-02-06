// @format

const PALETTE = {
  backgroundColor: "#ece7e7",
  metadata: "#777",
  blockquoteForeground: "#5a5a5a",
  monoText: "#314157",
  monoBackground: "#eee",
  linkText: "#07a",
  linkTextHover: "#2abfff",
  text: "#221100",
  textAccent: "#222",
};

const CONTENT_FONT = `
  sans-serif
`;

const MONOSPACE_FONT = `
  "SFMono-Regular",
  "Liberation Mono",
  Menlo,
  monospace
`;

const renderStyle = () => `

/* General */

  @font-face {
    font-family: 'Anderson Grotesk';
    font-style: normal;
    font-weight: normal;
    src: url('/static/anderson-grotesk-normal.woff2') format('woff2');
  }
  @font-face {
    font-family: 'Anderson Grotesk';
    font-style: normal;
    font-weight: bold;
    src: url('/static/anderson-grotesk-ultrabold.woff2') format('woff2');
  }
  @font-face {
    font-family: 'Anderson Grotesk';
    font-style: italic;
    font-weight: normal;
    src: url('/static/anderson-grotesk-oblique.woff2') format('woff2');
  }

  body {
    align-items: stretch;
    background-color: ${PALETTE.backgroundColor};
    color: ${PALETTE.text};
    display: grid;
    font-family: ${CONTENT_FONT};
    font-size: 1.2rem;
    grid-template-columns: minmax(2ch, 5vw) 1fr minmax(12em, 60ch) 1fr minmax(2ch, 5vw);
    grid-template-rows: 4.5rem 40px auto 70px;
    justify-items: stretch;
    line-height: 1.5;
    margin: 0;
    overflow-y: scroll;
  }
    body:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: white;
    }

    #content {
      grid-column-start: 4;
      grid-column-end: -4;
      grid-row-start: 3;
      grid-row-end: -2;
      transition: .2s;
      padding-bottom: 3rem;
    }

  p, blockquote, pre, ol, ul, .metadata {
    margin: 0 0 1.4rem;
    padding: 0;
  }

  ol, ul {
    margin-left: 2rem;
  }

  li {
    list-style-type: none;
  } 

  a {
    text-decoration: none;
    color: inherit;
  }

  .metadata {
    text-transform: uppercase;
    display: block;
    color: ${PALETTE.metadata};
    font-size: 0.95rem;
  }

    .metadata > *:not(:last-child):after {
      content: '\u00B7';
      margin: 0 .2rem;
    }


/* Header */

  #header {
    position: relative;
    display: flex;
    grid-column-end: 4;
    grid-column-start: 3;
    grid-row-end: 2;
    grid-row-start: 1;
  }

    #header .spacer {
      flex-grow: 1;
    }

    #header a {
      flex-grow: 0;
      text-transform: uppercase;
      color: ${PALETTE.linkText};
      font-size: 0.95rem;
      margin: 0;
      font-weight: bold;
      padding: 1rem 1.6rem; 
      box-sizing: border-box;
    }

  #logo {
    background-color: #c33800;
    border-radius: 0 0 6px 6px;
    box-shadow: inset 0 4px 0 0 #a62f00;
    position: relative;
  }

    #logo h1 {
      color: white;
      display: inline-block;
      font-size: 1rem;
      letter-spacing: 0.3ch;
      padding: 0;
      margin: 0;
      transition: 0.15s all ease-out;
      margin-left: 1.5ch;
    }

      .page-home #logo h1 {
        margin-left: 0;
      }

      body:not(.page-home) #logo:hover {
        opacity: .8;
      }

      body.page-home #logo:hover {
        cursor: default;
      }


    #logo::before {
      color: white;
      content: '\u00ab';
      left: calc(1.6rem - 0.3ch);
      position: absolute;
      top: 1rem;
    }

      .page-home #logo::before {
        left: 0;
        opacity: 0;
      }

    #header img {
      height: 40px;
      width: 40px;
      border-radius: 50%;
      transition: .2s;
      display: none;
    }


/* Home */

  #sections a {
    font-weight: 700;
    display: block;
    margin-bottom: 0.2rem;
  }

  #sections h2 {
    margin: 2.8rem 0 1.4rem;
  }

  #sections h2:not(.disabled) {
    font-weight: 300;
  }


/* Disabled sections */

  #sections > h2.disabled { 
    position: relative;
  }

    #sections > h2.disabled:before {
      position: absolute;
      top: 0; 
      left: 0; 
      bottom: 0; 
      right: 0;
      content: '';
      background: repeating-linear-gradient(45deg, transparent, transparent 1px, ${PALETTE.backgroundColor} 1px, ${PALETTE.backgroundColor} 2px);
    }


/* Quotes */

  blockquote {
    font-style: italic;
    color: ${PALETTE.blockquoteForeground};
    padding: 0 0 0 1rem;
    border-left: 2px dotted ${PALETTE.blockquoteForeground};
  }

    blockquote p:first-of-type::before {
      content: '“';
    }

    blockquote p:last-of-type::after {
      content: '”';
    }


/* Code */

  pre, code {
    font-family: ${MONOSPACE_FONT};
    font-size: 1.1rem;
    background: ${PALETTE.monoBackground};
    color: ${PALETTE.monoText}
  }

    pre {
      border-radius: .3rem;
      margin: 2rem 0;
      max-width: 80rem;
      min-width: 36rem;
      overflow: auto;
      padding: 1.2rem 1.2rem 1.5rem;
    }

    code {
      padding: .2rem .4rem;
      margin: 0 .2rem;
      vertical-align: baseline;
      border-radius: .4rem;
    }

    pre code {
      padding: 0;
      margin: 0;
      background: none;
    }


/* Links */

  body:not(.page-home) #content a {
    color: ${PALETTE.linkText};
    transition: .2s;
    box-shadow: inset 0 -1px 0 ${PALETTE.linkText};
  }

    body:not(.page-home) #content a:hover {
      color: ${PALETTE.linkTextHover};
      box-shadow: inset 0 -1px 0 ${PALETTE.linkTextHover};
    }


/* Headings */

  body:not(.page-home) #content h1 {
    font-size: 1.7rem;
    line-height: 1.4;
    margin-bottom: 0.4rem;
    margin-top: 2.8rem;
  }

  body:not(.page-home) #content .metadata {
    margin-bottom: 2.8rem;
  }

  body:not(.page-home) #content h2 {
    font-size: 1.4rem;
    margin-top: 2.8rem;
  }


/* Images */

  #content p {
    position: relative;
  }
  
  #content p > img {
    max-width: 100vw; 
    max-height: 32rem;
    margin-left: 50%;
    transform: translateX(-50%);
  }
`;

module.exports = renderStyle;
