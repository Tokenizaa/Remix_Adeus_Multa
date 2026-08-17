# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: onboarding-flow.spec.ts >> Complete Onboarding Flow - 11 Steps >> Step 7: Analysis Processing - Wait for Completion
- Location: tests/e2e/onboarding-flow.spec.ts:77:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Processamento da Análise')
Expected: visible
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('text=Processamento da Análise')
  - Target page, context or browser has been closed

```

```
Error: Channel closed
```