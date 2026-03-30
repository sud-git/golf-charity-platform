# Contributing to Golf Charity Platform

Thank you for your interest in contributing to the Golf Charity Platform! This document provides guidelines and instructions for contributing.

## Code of Conduct

Please be respectful and constructive in all interactions with other contributors and community members.

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher
- Git
- A Supabase account for testing

### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/sud-git/golf-charity-platform.git
cd golf-charity-platform

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Configure .env.local with your credentials
# (Never commit this file!)

# Start development server
npm run dev
```

## Making Changes

### Branch Naming

Use descriptive branch names following this pattern:

```
feature/feature-name       # New feature
bugfix/bug-name           # Bug fix
docs/doc-name             # Documentation
refactor/refactor-name    # Code refactoring
```

Example:
```bash
git checkout -b feature/add-draw-webhook
```

### Commit Messages

Follow conventional commits format:

```
type(scope): brief description

More detailed explanation if needed.

Fixes #issue-number (if applicable)
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style (formatting, missing semicolons, etc.)
- `refactor` - Code refactoring
- `perf` - Performance improvements
- `test` - Adding or updating tests
- `chore` - Build, dependencies, etc.

**Examples:**
```
feat(auth): add JWT refresh token rotation
fix(api): handle missing user ID in request headers
docs(deployment): update Vercel setup instructions
refactor(db): consolidate schema definitions
```

### Code Quality

Before committing, ensure code quality:

```bash
# Check TypeScript
npm run type-check

# Run linter
npm run lint

# Format code
npm run format
```

All checks must pass before submitting a pull request.

## Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature
   ```

2. **Make Changes**
   - Write clean, readable code
   - Follow the project's code style
   - Add comments for complex logic
   - Update relevant documentation

3. **Test Thoroughly**
   - Test all affected features
   - Verify no regressions
   - Test on different browsers if UI changes

4. **Push to GitHub**
   ```bash
   git push origin feature/your-feature
   ```

5. **Create Pull Request**
   - Provide clear description of changes
   - Reference related issues with `Fixes #123`
   - Include screenshots if UI changes
   - Ensure all checks pass

6. **Code Review**
   - Address review comments
   - Request re-review after changes
   - Be patient and collaborative

## Development Guidelines

### TypeScript Usage

- Use strict mode (already configured)
- Always provide explicit types for functions
- Avoid `any` type - use `unknown` when necessary
- Use interfaces for object types

```typescript
// ✅ Good
interface User {
  id: string;
  email: string;
  isAdmin: boolean;
}

function getUser(userId: string): Promise<User | null> {
  // implementation
}

// ❌ Avoid
function getUser(userId: any): any {
  // implementation
}
```

### Component Structure

```typescript
// ✅ Good functional component
import React from 'react';

interface ComponentProps {
  title: string;
  onSubmit: (value: string) => void;
}

export function MyComponent({ title, onSubmit }: ComponentProps): JSX.Element {
  const [state, setState] = React.useState('');

  const handleClick = (): void => {
    onSubmit(state);
  };

  return (
    <div>
      <h1>{title}</h1>
      <button onClick={handleClick}>Submit</button>
    </div>
  );
}
```

### Security Considerations

- **Never commit secrets** - Use environment variables
- **Validate all inputs** - Use Zod schemas
- **Protect sensitive routes** - Add authentication checks
- **Use prepared statements** - Always use Supabase client
- **Hash passwords** - Use bcryptjs
- **Sanitize error messages** - Don't leak sensitive info

### API Route Pattern

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/middleware';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const auth = await withAuth(request);
    if (!auth.valid) return auth.response;

    // Your logic here
    const result = await fetchData(auth.user.userId);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Testing

While the project doesn't have tests yet, please:

1. **Manual Testing**
   - Test the complete feature flow
   - Test edge cases
   - Test error scenarios
   - Test on mobile devices

2. **Documentation**
   - Document manual testing steps
   - Include screenshots if relevant

3. **Future Test Addition**
   - When test framework is added, write tests for new features
   - Aim for >80% coverage

## Documentation

- **README.md** - Update if user-facing features change
- **Code Comments** - Add comments for complex logic
- **API Documentation** - Document new endpoints in code
- **Type Definitions** - Keep types up-to-date

## Performance Considerations

- Minimize database queries
- Use pagination for large datasets
- Cache appropriate data
- Avoid unnecessary re-renders
- Profile before optimizing

## Accessibility

- Use semantic HTML
- Add alt text to images
- Ensure keyboard navigation works
- Test with screen readers
- Follow WCAG 2.1 guidelines

## Reporting Issues

### Bug Reports

Provide:
- Clear description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details (OS, browser, Node version)
- Screenshots/videos if applicable

### Feature Requests

Include:
- Clear description of the feature
- Use case and motivation
- Potential implementation approach
- Any alternatives considered

## Questions?

- Check existing issues first
- Review documentation
- Ask in GitHub Discussions

## Recognition

Contributors will be recognized in:
- README.md Contributors section
- Release notes
- Project website (when available)

---

Thank you for contributing to make Golf Charity Platform better! 🎉
