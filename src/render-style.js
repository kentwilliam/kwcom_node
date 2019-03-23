// @format

const PALETTE = {
  background: "#17222A",
  foreground: "white",
  accent: "#EB5434",
  subdued: "#B7CADD"
};

const renderStyle = () => `
  body {
    font-family: 'Heebo', sans-serif;
    background: ${PALETTE.background};
    color: ${PALETTE.foreground};
    font-size: 15px;
    margin: 0;
    padding: 6em 4em;
  }

  #logo {
    color: ${PALETTE.subdued};
    font-size: 80%;
    font-weight: 300;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    word-spacing: 0.1em;
    transition: all .3s;
    transform: translateX(0);
  }
    #logo span {
      font-weight: 700;
    }
    .page-article #logo {
    }

  p, blockquote, pre, li {
    max-width: 36em;
    line-height: 1.7em;
    font-weight: 300;
  }

  p, li {
    margin-bottom: 1.3em;
  }

  pre, code {
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
    font-size: 90%;
    background: rgba(0,0,0,.5);
    color: ${PALETTE.subdued};
  }
    pre {
      padding: 1.6em 2em; 
      border-radius: 2em 0 2em 0;
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

  a {
    color: ${PALETTE.accent};
    text-decoration: none;
    box-shadow: inset 0 -1px 0 #82392A;
    transition: border .3s;
  }
    a:hover {
      box-shadow: inset 0 -1px 0 ${PALETTE.accent};
    }

  h1, h2, h3 {
    margin-top: 2em;
    font-weight: 700;
  }
    h1 a, h2 a, h3 a {
      font-weight: inherit;
      color: inherit;
      box-shadow: none;
    }
    h1 { font-size: 190%; }
    h2 { font-size: 150%; }
    h3 { font-size: 110%; }
`;

module.exports = renderStyle;
