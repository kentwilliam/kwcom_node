// @format

const PALETTE = {
  backgroundColor: "#2b2a2a",
  metadata: "#999",
  blockquoteForeground: "#999",
  monoText: "#eee",
  monoBackground: "#444",
  linkText: "#ffad80",
  linkTextHover: "#ffd0b6",
  text: "#eee",
  textAccent: "#acf",
  textHeader: "#fff",
};

const FONTS = {
  content: `sohne, serif`,
  monospace: `sohne-mono, serif`,
};

const renderStyle = () => `

@font-face {
  font-family: 'sohne';
  font-weight: 700;
  font-style: normal;
  src: url('/static/soehne-halbfett.woff2') format('woff');
}

@font-face {
  font-family: 'sohne';
  font-weight: 400;
  font-style: normal;
  src: url('/static/soehne-buch.woff2') format('woff');
}

@font-face {
  font-family: 'sohne';
  font-weight: 400;
  font-style: italic;
  src: url('/static/soehne-buch-kursiv.woff2') format('woff');
}

@font-face {
  font-family: 'sohne-mono';
  font-weight: 400;
  font-style: normal;
  src: url('/static/soehne-mono-buch.woff2') format('woff');
}

/* General */

  body {
    align-items: stretch;
    background-color: ${PALETTE.backgroundColor};
    color: ${PALETTE.text};
    display: grid;
    font-family: ${FONTS.content};
    font-size: 1.1rem;
    grid-template-columns: minmax(2ch, 5vw) 1fr minmax(12em, 70ch) 1fr minmax(2ch, 5vw);
    grid-template-rows: 6rem 40px auto 70px;
    justify-items: stretch;
    line-height: 1.6;
    margin: 0;
    overflow-y: scroll;
  }

  @media (min-width: 600px) {
    body {
      font-size: 1.2rem;
    }
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
    margin: 0 0 1.7rem;
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
    display: flex;
    color: ${PALETTE.metadata};
    font-size: 0.95rem;
    align-items: center;
    white-space: nowrap;
    flex-wrap: wrap;
  }

.metadata > * {
    display: flex;
    align-items: center;
}

    .metadata > *:not(:last-child):after {
      content: '\u00B7';
      margin: 0 1ch;
    }

    .metadata .byline {
      border-radius: 50%;
      height: 24px;
      margin-right: 0.8ch;
      display: flex;
      flex-shrink: 0;
      align-items: center;
    }


/* Header */

  #header {
    position: relative;
    display: flex;
    grid-column-end: 4;
    grid-column-start: 3;
    grid-row-end: 2;
    grid-row-start: 1;
    align-items: center;
  }

    #header .spacer {
      flex-grow: 1;
    }

    #header a {
      flex-grow: 0;
      color: ${PALETTE.linkText};
      box-sizing: border-box;
    }

    #logo h1 {
      font-size: 1.1rem;
      font-weight: normal;
      padding: 0;
      margin: 0;
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

  #bio {
    margin-bottom: 2.3rem;
    padding-bottom: 3rem;
  }

    #bio ul {
      padding: 0;
      margin: 0;
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }
    #bio li {
      border-radius: 16px;
      overflow: hidden;
      flex-shrink: 0;
    }
    #bio li a {
      display: flex;
      flex-direction: column;
      padding: 1ch 2ch;
      background: rgba(255,255,255,0.05);
      font-size: 0.9rem;
    }
      #bio li a:hover {
        background: rgba(255,255,255,0.1);
      }
      #bio li span {
        color: ${PALETTE.text};
margin-bottom: -0.3rem;
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
    font-size: 1rem;
    background: ${PALETTE.monoBackground};
    color: ${PALETTE.monoText}
  }

    pre {
      border-radius: .3rem;
      margin: 2rem 0;
      overflow: auto;
      padding: 0.8rem 1.2rem 1.3rem;
    }

    code {
      padding: 0 .4rem;
      margin: 0 .3rem;
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
      transparent calc(0.9em + 6px), 
      ${PALETTE.linkText} calc(0.9em + 7px), 
      transparent calc(0.9em + 7px)
    );
  }

    #content a:hover {
      color: ${PALETTE.linkTextHover};
      background-image: repeating-linear-gradient(
        180deg, 
        transparent 0, 
        transparent calc(0.9em + 6px), 
        ${PALETTE.linkTextHover} calc(0.9em + 7px), 
        transparent calc(0.9em + 7px)
      );
    }


/* Lists */
  
  body:not(.page-root) #content li {
    list-style-type: disc;
    padding-left: 0.3ch;
    margin: 0 0 0.7rem;
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
    margin-top: 1.4rem;
  }

  body:not(.page-root) #content h2 {
    font-size: 1.4rem;
    margin-top: 2.8rem;
  }

  body:not(.page-root) #content h2 > a {
    color: ${PALETTE.textHeader};
    text-decoration: none;
    background: none;
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
