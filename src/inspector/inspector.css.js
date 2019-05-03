export default `
:root {
  --backgroundColor: #1c1f21;
  --topBarHeight: 30px;
}
* {
  box-sizing: border-box;
}
html {
  -webkit-font-smoothing: antialiased;
}
body {
  background: var(--backgroundColor);
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  margin: 0;
}
#bar {
  align-items: center;
  background: var(--backgroundColor);
  border-bottom: 1px solid black;
  display: flex;
  font-size: 14px;
  height: var(--topBarHeight);
  justify-content: center;
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 10;
}
#iframe {
  background: white;
  border: none;
  border-left: 2px solid black;
  height: calc(100% - var(--topBarHeight));
  position: fixed;
  right: 0;
  top: var(--topBarHeight);
  width: 40%;
}
#editor {
  height: calc(100% - var(--topBarHeight));
  left: 0;
  position: fixed;
  top: var(--topBarHeight);
  width: 60%;
}
`
