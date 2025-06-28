# Contributing Guidelines

Thank you for your interest in contributing to Task Management Elite! This document provides guidelines and instructions for contributing to this project.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- PostgreSQL 16+ (or use Docker)
- Git

### Setup Development Environment

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/task-management-elite.git
   cd task-management-elite
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Database Setup**
   ```bash
   # Using Docker (recommended)
   docker-compose up -d postgres redis
   npm run db:migrate
   
   # Or with local PostgreSQL
   createdb taskmanagement
   npm run db:migrate
   ```

5. **Start Development**
   ```bash
   npm run dev
   ```

## 🔄 Development Workflow

### Branch Strategy

We use a Git Flow-inspired branching strategy:

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - Feature development branches
- `hotfix/*` - Critical bug fixes
- `release/*` - Release preparation branches

### Creating a Feature

1. **Create Feature Branch**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write code following our coding standards
   - Add tests for new functionality
   - Update documentation if needed

3. **Test Your Changes**
   ```bash
   npm run test
   npm run lint
   npm run type-check
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   # Create Pull Request to develop branch
   ```

## 📝 Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/) for consistent commit messages:

### Format
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks
- `perf:` - Performance improvements
- `ci:` - CI/CD changes

### Examples
```bash
feat: add task creation functionality
fix: resolve authentication token expiration
docs: update API documentation
test: add unit tests for user service
refactor: optimize database queries
```

## 🧪 Testing Guidelines

### Running Tests

```bash
# Run all tests
npm test

# Run specific package tests
npm run test:client
npm run test:server

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e
```

### Writing Tests

- **Unit Tests**: Test individual functions/components
- **Integration Tests**: Test API endpoints and database interactions
- **E2E Tests**: Test complete user workflows

### Test Structure
```typescript
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup
  });

  it('should do something specific', () => {
    // Arrange
    // Act
    // Assert
  });

  afterEach(() => {
    // Cleanup
  });
});
```

## 🎨 Code Style Guidelines

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Prefer functional programming patterns

### React Components

```typescript
// Good
interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick: () => void;
  children: React.ReactNode;
}

export function Button({ variant, onClick, children }: ButtonProps) {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

### API Routes

```typescript
// Good
router.get('/users', authenticate, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const users = await userService.getUsers();
  
  res.json({
    success: true,
    data: { users }
  });
}));
```

## 📁 Project Structure

```
task-management/
├── client/                 # Next.js frontend
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # Reusable components
│   │   ├── lib/          # Utilities and API client
│   │   └── stores/       # State management
├── server/                # Express backend
│   ├── src/
│   │   ├── db/           # Database schema and connection
│   │   ├── middleware/   # Express middleware
│   │   ├── routes/       # API routes
│   │   └── utils/        # Server utilities
└── shared/               # Shared types and utilities
    └── src/
        ├── types/        # TypeScript types
        └── utils/        # Shared utilities
```

## 🔍 Code Review Process

### Before Submitting PR

- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] Documentation updated
- [ ] No console.log statements
- [ ] TypeScript types are properly defined
- [ ] Error handling is implemented

### PR Requirements

- Clear title and description
- Link to related issues
- Screenshots for UI changes
- Test coverage for new features
- Breaking changes documented

### Review Checklist

Reviewers should check:

- [ ] Code quality and readability
- [ ] Test coverage
- [ ] Security considerations
- [ ] Performance implications
- [ ] Documentation completeness

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Environment Details**
   - OS and version
   - Node.js version
   - Browser (for frontend issues)

2. **Steps to Reproduce**
   - Clear, numbered steps
   - Expected vs actual behavior
   - Screenshots if applicable

3. **Additional Context**
   - Error messages
   - Console logs
   - Network requests (if relevant)

## 💡 Feature Requests

For new features:

1. **Use Case**: Describe the problem you're solving
2. **Proposed Solution**: How should it work?
3. **Alternatives**: Other solutions considered
4. **Additional Context**: Mockups, examples, etc.

## 📚 Documentation

### API Documentation

- Use JSDoc for inline documentation
- Update OpenAPI/Swagger specs
- Include request/response examples

### Component Documentation

- Document props and usage
- Include Storybook stories
- Add accessibility notes

## 🚀 Release Process

1. **Create Release Branch**
   ```bash
   git checkout develop
   git checkout -b release/v1.2.0
   ```

2. **Update Version**
   ```bash
   npm version minor
   ```

3. **Test Release**
   ```bash
   npm run build
   npm run test
   ```

4. **Merge to Main**
   ```bash
   git checkout main
   git merge release/v1.2.0
   git tag v1.2.0
   ```

5. **Deploy**
   ```bash
   git push origin main --tags
   ```

## 🤝 Community Guidelines

- Be respectful and inclusive
- Help others learn and grow
- Share knowledge and best practices
- Follow the code of conduct

## 📞 Getting Help

- **Issues**: GitHub Issues for bugs and features
- **Discussions**: GitHub Discussions for questions
- **Discord**: Join our community server
- **Email**: maintainers@taskmanagement.dev

## 🙏 Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes
- Annual contributor highlights

Thank you for contributing to Task Management Elite! 🎉
