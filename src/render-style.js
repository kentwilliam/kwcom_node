// @format

const PALETTE = {
  pageBackground: "white",
  contentBackground: "#F0EBE9",
  altBackground: "#FAF7F5",
  codeBackground: "#FAF7F5",
  text: "#2E3642",
  accent: "#CA1F4F",
  subdued: "#B7CADD"
};

const renderStyle = () => `
  body {
    font-family: 'Heebo', sans-serif;
    background: ${PALETTE.pageBackground};
    color: ${PALETTE.text};
    font-size: 15px;
    margin: 0;
    /* padding: 6em 4em; */
    display: grid;
    grid-template-columns: 35px 35px 35px 35px 50px 20px repeat(auto-fill, 70px) minmax(0, 1fr) 35px; 
    grid-template-rows: 50px 20px 70px 70px auto 70px;
    align-items: stretch;
    justify-items: stretch;
  }
    body::after {
      background: ${PALETTE.altBackground};
      content: '';
      grid-column-end: -2;
      grid-column-start: 14;
      grid-row-end: -2;
      grid-row-start: 3;
    }

  #content-background {
    background: ${PALETTE.contentBackground};
    grid-column-start: 2;
    grid-column-end: -2;
    grid-row-start: 3;
    grid-row-end: -2;
  }

  #logo {
    background: ${PALETTE.accent};
    background-blend-mode: multiply;
    display: block;
    font-size: 135%;
    grid-column-start: 4;
    grid-column-end: 6;
    grid-row-start: 2;
    grid-row-end: 4;
    line-height: 710%;
    margin: 0;
    text-indent: .5em;
  }
    #logo a {
      text-decoration: none;
      transition: .2s;
      color: white;
    }
      #logo a:hover {
        color: #3B0000;
      }

  #headshot {
    background: url(https://pbs.twimg.com/profile_images/558801904088535040/hq0Ry4MO_400x400.jpeg);
    background-size: cover;
    opacity: .5;
    grid-column-start: 5;
    grid-column-end: 7;
    grid-row-start: 3;
    grid-row-end: 4;
  }

  #content {
    grid-column-start: 4;
    grid-column-end: -4;
    grid-row-start: 5;
    grid-row-end; -2;
    transition: .2s;
    padding-bottom: 3em;
  }

  #menu {
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 5;
    grid-row-end: -1;
    transition: .4s;
    position: relative;
    z-index: 1;
  }
    body.page-home #menu {
      left: 80px; 
    }
    #menu a {
      color: ${PALETTE.text};
      font-size: 40px;
      display: block;
      color: ${PALETTE.text};
      white-space: nowrap;
      height: 70px;
      line-height: 78px;
      text-decoration: none;
      text-transform: uppercase;
      position: relative;
    }
      #menu a::before {
        content: '';
        border-radius: 50%;
        height: 100px;
        width: 100px;
        transform: scale(0, 0);
        transition: .2s;
        position: absolute;
        left: -16px;
        top: -13px;
        pointer-events: none;
        background: white;
      }
        #menu a:hover::before {
          transform: scale(1, 1);
        }
      #menu a > strong {
        position: relative;
        font-weight: 700;
        display: inline-block;
        text-align: center;
        width: 70px;
        transition: .2s;
      }
        #menu a:hover > strong {
          color: ${PALETTE.accent};
        }
      #menu a > span {
        position: relative;
        margin-left: -.52em;
        opacity: 0;
        font-weight: 700;
        transition: .2s;
        color: ${PALETTE.accent};
      }
        #menu a:hover > span {
          opacity: 1;
        }
      #menu:hover ~ #content {
        opacity: .1;
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
    font-size: 95%;
    color: ${PALETTE.text};
    background: ${PALETTE.codeBackground};
  }
    pre {
      padding: 1.6em 2em; 
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
    color: ${PALETTE.accent};
    text-decoration: none;
    box-shadow: inset 0 -1px 0 #E6B8C5;
    transition: box-shadow .3s;
  }
    #content a:hover {
      box-shadow: inset 0 -1px 0 ${PALETTE.accent};
    }

  #content h1, h2, h3 {
    margin: 0;
    font-weight: 700;
    font-size: 120%;
    line-height: inherit;
  }
    #content h1 a, #content h2 a, #content h3 a {
      font-weight: inherit;
      color: inherit;
      box-shadow: none;
    }

  #content h1 {
    position: relative;
    padding: 15px 0 23px;
  }
    #content h1::after {
      width: 4px;
      height: 4px;
      position: absolute;
      bottom: 8px;
      left: 0;
      background: ${PALETTE.accent};
      content: '';
    }
  
  #content h2 {
    padding: 8px 0 0;
  }
`;

module.exports = renderStyle;
