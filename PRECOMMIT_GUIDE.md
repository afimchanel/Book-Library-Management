# Pre-commit Hooks & Code Quality Setup

## ⚙️ Configuration Overview

This project uses **CSpell**, **ESLint**, **Prettier**, and **Husky** to maintain code quality and prevent common issues before commits.

---

## 🚫 Blocked Patterns

### 1. `console.log()` - ❌ BLOCKED
```typescript
// ❌ Will fail pre-commit
console.log('debug info');

// ✅ Allowed alternatives
console.error('error message');
console.warn('warning message');
console.info('info message');
```

### 2. `any` type - ❌ BLOCKED
```typescript
// ❌ Will fail pre-commit
const data: any = { ... };
function process(param: any) { ... }

// ✅ Use proper types
const data: User = { ... };
function process(param: string | number) { ... }
```

---

## 📋 Pre-commit Checklist

### Backend (d:\work\challenge\backend\.husky\pre-commit)
When you commit backend code, the following runs automatically:

1. ✅ **TypeScript Check** - `npx tsc --noEmit`
   - Validates type safety without compilation
   
2. ✅ **Migration Check** - `npm run migration:run`
   - Ensures database schema is up to date
   
3. ✅ **Migration Files Check**
   - Fails if new migration files exist but aren't staged
   
4. ✅ **Lint & Spell Check** - `lint-staged`
   - ESLint: No `console.log()`, no `any`
   - CSpell: Spell checking
   - Prettier: Code formatting
   
5. ✅ **Tests** - `npm run test`
   - Runs all unit tests

### Frontend (d:\work\challenge\frontend\.husky\pre-commit)
When you commit frontend code:

1. ✅ **TypeScript Check** - `npx tsc --noEmit`
   
2. ✅ **Lint & Spell Check** - `lint-staged`
   - ESLint: No `console.log()`, no `any`
   - CSpell: Spell checking

---

## 🛠️ Available Commands

### Backend Commands
```bash
cd backend

# Run linter (with auto-fix)
npm run lint

# Run linter (check only, no auto-fix)
npm run lint:check

# Fix formatting
npm run format

# Run spell check
npm run spell

# Run all checks manually
npm run lint:check && npm run spell:check && npm test
```

### Frontend Commands
```bash
cd frontend

# Run linter (with auto-fix)
npm run lint

# Run linter (check only)
npm run lint:check

# Check TypeScript types
npm run typecheck

# Run spell check
npm run spell
```

---

## 🔧 Configuration Files

### Backend
- **`.eslintrc.js`** - ESLint rules (blocks `console.log`, `any`)
- **`cspell.json`** - Spell checker dictionary & settings
- **`.husky/pre-commit`** - Git pre-commit hook script
- **`package.json`** - `lint-staged` configuration

### Frontend
- **`eslint.config.js`** - ESLint rules (blocks `console.log`, `any`)
- **`cspell.json`** - Spell checker dictionary & settings
- **`.husky/pre-commit`** - Git pre-commit hook script
- **`package.json`** - `lint-staged` configuration

---

## 🚨 Common Issues & Solutions

### Issue 1: "Unexpected console statement"
```typescript
// ❌ Error
console.log('debug');

// ✅ Solution 1: Use proper logging
console.error('error message'); // Allowed

// ✅ Solution 2: Use a logger library
import { Logger } from '@nestjs/common';
const logger = new Logger('MyService');
logger.log('message');

// ✅ Solution 3: Temporarily disable (use sparingly)
// eslint-disable-next-line no-console
console.log('important debug info');
```

### Issue 2: "Unexpected any"
```typescript
// ❌ Error
function getData(): any { ... }

// ✅ Solution 1: Use proper types
function getData(): User[] { ... }

// ✅ Solution 2: Use unknown if type is truly unknown
function getData(): unknown { ... }

// ✅ Solution 3: Use generic types
function getData<T>(): T { ... }

// ✅ Solution 4: Temporarily disable (use sparingly)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function legacy(): any { ... }
```

### Issue 3: Spell Check Failures
```bash
# Add word to dictionary
# Edit cspell.json and add to "words" array
{
  "words": [
    "myword",
    "customterm"
  ]
}
```

### Issue 4: Pre-commit Hook Fails
```bash
# Skip hooks temporarily (NOT RECOMMENDED)
git commit --no-verify -m "message"

# Better: Fix the issues
npm run lint
npm run format
npm test
```

### Issue 5: Migration Files Not Staged
```bash
# Generate migration
npm run migration:generate -- src/database/migrations/my-change

# Stage the generated file
git add src/database/migrations/*.ts

# Now commit
git commit -m "Add migration"
```

---

## 📊 Lint-Staged Configuration

### Backend (package.json)
```json
{
  "lint-staged": {
    "*.ts": [
      "eslint",                      // Check for errors (no auto-fix)
      "cspell --no-must-find-files", // Spell check
      "prettier --write"             // Format code
    ],
    "*.{json,md}": [
      "cspell --no-must-find-files",
      "prettier --write"
    ]
  }
}
```

### Frontend (package.json)
```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint",                      // Check for errors (no auto-fix)
      "cspell --no-must-find-files"  // Spell check
    ],
    "*.{json,md}": [
      "cspell --no-must-find-files"
    ]
  }
}
```

---

## 🎯 Best Practices

1. **Commit Often, Commit Early**
   - Pre-commit checks are fast when you commit small changes
   
2. **Fix Issues Immediately**
   - Don't skip pre-commit hooks (`--no-verify`)
   - Address linting errors as they appear
   
3. **Use Proper Types**
   - Avoid `any` - it defeats TypeScript's purpose
   - Use `unknown` if type is truly unknown
   
4. **Use Proper Logging**
   - Backend: Use NestJS Logger
   - Frontend: Use console.error/warn/info or a logging library
   
5. **Keep Dependencies Updated**
   ```bash
   npm run spell:check  # Before committing
   npm run lint:check   # Before committing
   npm test            # Before committing
   ```

---

## 📝 Adding Custom Words to Dictionary

### Backend: `backend/cspell.json`
```json
{
  "words": [
    "nestjs",
    "typeorm",
    "postgres",
    // Add your custom words here
  ]
}
```

### Frontend: `frontend/cspell.json`
```json
{
  "words": [
    "tanstack",
    "zustand",
    "tailwindcss",
    // Add your custom words here
  ]
}
```

---

## 🔍 Manual Pre-commit Check

Before committing, you can manually run all checks:

### Backend
```bash
cd backend
npx tsc --noEmit && \
npm run migration:run && \
npm run lint:check && \
npm run spell:check && \
npm test
```

### Frontend
```bash
cd frontend
npx tsc --noEmit && \
npm run lint:check && \
npm run spell:check
```

---

## 📚 Further Reading

- [ESLint Rules](https://eslint.org/docs/latest/rules/)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [CSpell Documentation](https://cspell.org/)
- [Husky Documentation](https://typicode.github.io/husky/)
- [Lint-Staged](https://github.com/lint-staged/lint-staged)
