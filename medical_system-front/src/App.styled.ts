import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  :root {
    --font-size: 16px;
    --input-background: #f3f3f5;
    --switch-background: #cbced4;
    --font-weight-medium: 500;
    --font-weight-normal: 400;
  }

  html {
    font-size: var(--font-size);
  }

  body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin: 0;
    font-family: system-ui, -apple-system, sans-serif;
  }

  h1, h2, h3, h4, label, button {
    font-weight: var(--font-weight-medium);
    line-height: 1.5;
  }

  h1 { font-size: 1.5rem; }
  h2 { font-size: 1.25rem; }
  h3 { font-size: 1.125rem; }
  h4, label, button, input { font-size: 1rem; }

  input {
    font-weight: var(--font-weight-normal);
    background-color: var(--input-background);
  }
`

export default GlobalStyles