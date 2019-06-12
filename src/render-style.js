// @format

const PALETTE = {
  logoBackground: "black",
  logoBackgroundHover: "navy",
  monoBackground: "#343B3B",
  pageBackground: "#222626",
  text: "#ccc",
  textAccent: "white"
};

const MONOSPACE = `
  "SFMono-Regular",
  Consolas,
  "Liberation Mono",
  Menlo,
  Courier,
  monospace
`;

const CONTENT_FONT = `'Source Sans Pro', sans-serif`;

const HEADING_FONT = `'Playfair Display', serif`;

const renderStyle = () => `
  body {
    font-family: ${CONTENT_FONT};
    background-color: ${PALETTE.pageBackground};
    color: ${PALETTE.text};
    font-size: 17px;
    margin: 0;
    display: grid;
    grid-template-columns: 40px 1fr minmax(12em, 36em) 1fr 40px; 
    grid-template-rows: 120px 40px auto 70px;
    align-items: stretch;
    justify-items: stretch;
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
    position: relative;
  }
    #logo a {
      border-radius: 30px;
      color: ${PALETTE.textAccent};
      background: ${PALETTE.logoBackground};
      text-decoration: none;
      transition: .4s;
      font-size: 100%;
      height: 40px;
      width: 40px;
      position: absolute;
      left: 0;
      top: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
    }
      #logo a span {
        position: relative;
        top: -2px;
      }
      #logo a:hover {
        background: ${PALETTE.logoBackgroundHover};
      }
  
  #menu {
    display: none;
  }    

  #content {
    grid-column-start: 4;
    grid-column-end: -4;
    grid-row-start: 3;
    grid-row-end; -2;
    transition: .2s;
    padding-bottom: 3em;
    font-weight: 300;
  }

  p, blockquote, pre, li {
    max-width: 36em;
    line-height: 1.7em;
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
    font-family: "Cousine", monospace;
    font-size: 15px;
    background: ${PALETTE.monoBackground};
  }
    pre {
      padding: 1.3em 1.7em; 
      border-radius: .3em;
      margin: 2em 0;
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

  #content a {
    color: ${PALETTE.text};
    text-decoration: none;
    box-shadow: inset 0 -1px 0 ${PALETTE.text};
    transition: .3s;
  }
    #content a:hover {
      color: ${PALETTE.textAccent};
      box-shadow: inset 0 -1px 0 ${PALETTE.textAccent};
    }

  #content h1, h2, h3 {
    margin: 0;
    font-weight: 400;
    line-height: inherit;
  }
    #content h1 a, #content h2 a, #content h3 a {
      font-weight: inherit;
      color: inherit;
      box-shadow: none;
    }
      #content h1 a:hover, #content h2 a:hover, #content h3 a:hover {
        color: ${PALETTE.textAccent};
      }

  #content h1 {
    position: relative;
    padding: 15px 0 23px;
    font-size: 240%;
    font-family: ${HEADING_FONT};
    font-weight: 700;
  }
  
  #content h2 {
    padding: 1.6em 0 0;
    font-size: 100%;
    font-family: ${CONTENT_FONT};
    text-transform: uppercase;
    font-weight: 700;
  }
`;

module.exports = renderStyle;
