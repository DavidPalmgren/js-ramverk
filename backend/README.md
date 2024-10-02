<<<<<<< HEAD
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
=======
# SSR Editor

Starter project for DV1677 JSRamverk

## Ändringar 
Vi fick lägga till en .env fil, initiera databasen, göra det möjligt för användaren att uppdatera dokument, skapa en POST route istället för PUT(eftersom det inte finns en PUT method i HTML forms, skapa create route.

## Val av ramverk
Vi valde att för det här projektet använda react, vi valde det för att det är ett populärt ramverk som användes mycket inom industrin och kan leda till mer arbetsmöjligheter i framtiden. En annan anledning var att vi hade redan använt Vue för vårt senaste grupparbete och vill utbredda våra kunskaper och testa på lite nya möjligheter med React.
>>>>>>> cf358b3fafd94cc2bc258a38b6844f51251aa647
