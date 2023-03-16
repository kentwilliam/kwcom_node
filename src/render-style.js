// @format

const PALETTE = {
  backgroundColor: "#ece7e7",
  metadata: "#777",
  blockquoteForeground: "#5a5a5a",
  monoText: "#6d1f00",
  monoBackground: "#d8d1d1",
  linkText: "#07a",
  linkTextHover: "#2abfff",
  text: "#221100",
  textAccent: "#222",
};

const FONTS = {
  content: `sans-serif`,
  monospace: `"SFMono-Regular", "Liberation Mono", Menlo, monospace`,
};

const renderStyle = () => `

/* General */

  body {
    align-items: stretch;
    background-color: ${PALETTE.backgroundColor};
    color: ${PALETTE.text};
    display: grid;
    font-family: ${FONTS.content};
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

  body:not(.page-root) ol, ul {
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
      margin: 0 .8ch;
    }

    .metadata .byline {
      border-radius: 50%;
      height: 24px;
      width: 24px;
      line-height: 0;
      float: left;
      margin-right: 1ch;
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
    display: flex;
    align-items: flex-end;
    position: relative;
  }

    #logo h1 {
      color: white;
      display: inline-block;
      font-size: 1rem;
      font-weight: normal;
      letter-spacing: 0.6ch;
      padding: 0;
      margin: 0;
      transition: 0.15s all ease-out;
      margin-left: 1.5ch;
    }

      .page-root #logo h1 {
        margin-left: 0;
      }

      body:not(.page-root) #logo:hover {
        opacity: .8;
      }

      body.page-root #logo:hover {
        cursor: default;
      }


    #logo::before {
      bottom: 1rem;
      color: white;
      content: '\u00ab';
      font-weight: normal;
      left: calc(1.6rem - 0.3ch);
      position: absolute;
    }

      .page-root #logo::before {
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
    display: inline;
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
    font-family: ${FONTS.monospace};
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

  #content a {
    color: ${PALETTE.linkText};
    transition: .2s;
    background-image: repeating-linear-gradient(
      180deg, 
      transparent 0, 
      transparent calc(1em + 5px), 
      ${PALETTE.linkText} calc(1em + 6px), 
      transparent calc(1em + 6px)
    );
  }

    #content a:hover {
      color: ${PALETTE.linkTextHover};
      background-image: repeating-linear-gradient(
        180deg, 
        transparent 0, 
        transparent calc(1em + 5px), 
        ${PALETTE.linkTextHover} calc(1em + 6px), 
        transparent calc(1em + 6px)
      );
    }


/* Lists */
  
  body:not(.page-root) #content li {
    list-style-type: disc;
    padding-left: 0.3ch;
  }


/* Headings */

  body:not(.page-root) #content h1 {
    font-size: 1.9rem;
    line-height: 1.4;
    margin-bottom: 0.4rem;
    margin-top: 2.8rem;
  }

  body:not(.page-root) #content .metadata {
    margin-bottom: 2.8rem;
    margin-top: 1rem;
  }

  body:not(.page-root) #content h2 {
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
