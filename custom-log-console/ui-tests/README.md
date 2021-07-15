To execute integration tests, you need to:

1. Start JupyterLab with the extension installed without any token or password

```
jupyter lab --ServerApp.token= --ServerApp.password=
```

2. Execute in another console the [Playwright](https://playwright.dev/docs/test-intro) tests:

```
jlpm install
npx playwright test
```
