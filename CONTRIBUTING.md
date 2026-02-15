# Contributing to PlayVerse

Thank you for your interest in contributing to PlayVerse! This document provides guidelines and instructions for contributing to the project.

## 🤝 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- Git
- Basic understanding of TypeScript, React, and Node.js
- Familiarity with PostgreSQL and Prisma

### Setting Up Your Development Environment

1. **Fork the repository** on GitHub

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Game-Website.git
   cd Game-Website
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/Pr0gr4m3r74/Game-Website.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Set up environment variables**
   ```bash
   cp packages/backend/.env.example packages/backend/.env
   cp packages/frontend/.env.example packages/frontend/.env
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

## 📝 Development Workflow

### 1. Create a Feature Branch

Always create a new branch for your changes:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests

### 2. Make Your Changes

- Write clear, self-documenting code
- Follow the existing code style (enforced by ESLint and Prettier)
- Add comments for complex logic
- Update documentation if needed

### 3. Test Your Changes

```bash
# Run linting
npm run lint

# Format your code
npm run format

# Run tests
npm test

# Build to ensure no compilation errors
npm run build
```

### 4. Commit Your Changes

Write meaningful commit messages following this format:

```
<type>: <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Example:
```bash
git commit -m "feat: add real-time chat to game rooms

Implemented WebSocket-based chat system that allows players
to communicate in real-time during game sessions.

Closes #123"
```

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- Clear title describing the change
- Description of what was changed and why
- Screenshots/videos for UI changes
- Reference to related issues

## 🏗️ Project Structure

Understanding the codebase:

```
packages/
├── frontend/          # Next.js application
│   ├── src/
│   │   ├── app/      # Pages and layouts
│   │   ├── components/  # Reusable components
│   │   ├── lib/      # Utilities and API client
│   │   └── styles/   # CSS and Tailwind
│   └── public/       # Static assets
│
├── backend/          # Express.js API
│   ├── src/
│   │   ├── controllers/  # Route handlers
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Custom middleware
│   │   └── config/       # Configuration
│   └── prisma/       # Database schema
│
└── shared/           # Shared types and utilities
    └── src/
        ├── types.ts   # TypeScript interfaces
        └── utils.ts   # Shared functions
```

## 🎨 Code Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Define interfaces for all data structures
- Avoid `any` type when possible
- Use meaningful variable and function names

### React/Next.js

- Use functional components with hooks
- Keep components small and focused
- Use TypeScript for props
- Follow React best practices

### Backend

- Use async/await for asynchronous code
- Implement proper error handling
- Add input validation for all endpoints
- Follow REST API conventions

### Database

- Write Prisma migrations for schema changes
- Include seed data for new features
- Optimize queries for performance

## 🧪 Testing Guidelines

### Writing Tests

- Write tests for new features
- Maintain existing test coverage
- Test edge cases and error scenarios
- Use descriptive test names

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests for specific package
npm test --workspace=packages/backend
```

## 📚 Documentation

### Updating Documentation

- Update README.md for major changes
- Add inline comments for complex code
- Document new API endpoints
- Update type definitions

### API Documentation

When adding new endpoints:
1. Document the endpoint in README.md
2. Include request/response examples
3. Describe query parameters
4. List possible error responses

## 🐛 Reporting Bugs

### Before Reporting

1. Check existing issues
2. Verify it's reproducible
3. Test on the latest version

### Bug Report Template

```markdown
**Description**
A clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Screenshots**
If applicable

**Environment**
- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 120]
- Node Version: [e.g., 18.17.0]
```

## 💡 Suggesting Features

### Feature Request Template

```markdown
**Problem**
Describe the problem this feature would solve

**Proposed Solution**
Your proposed solution

**Alternatives Considered**
Alternative solutions you've considered

**Additional Context**
Any other relevant information
```

## 🔍 Code Review Process

### As an Author

- Respond to feedback promptly
- Be open to suggestions
- Update PR based on review comments
- Keep PRs focused and reasonably sized

### As a Reviewer

- Be constructive and respectful
- Explain the reasoning behind suggestions
- Approve if changes look good
- Test locally if needed

## 📋 Pull Request Checklist

Before submitting a PR, ensure:

- [ ] Code follows the style guidelines
- [ ] Tests pass locally
- [ ] Linting passes (npm run lint)
- [ ] Code is formatted (npm run format)
- [ ] Documentation is updated
- [ ] Commit messages are clear
- [ ] PR description is complete
- [ ] Related issues are referenced
- [ ] Screenshots included for UI changes

## 🎯 Areas for Contribution

Looking for where to start? Check out:

- **Good First Issues**: Tagged issues suitable for beginners
- **Help Wanted**: Issues where we need community help
- **Documentation**: Always room for improvement
- **Testing**: Increase test coverage
- **Performance**: Optimization opportunities
- **Accessibility**: Make the app more accessible

## 🙏 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in relevant documentation

## 📞 Getting Help

- Open an issue for questions
- Join discussions in GitHub Discussions
- Check existing documentation
- Review closed issues for similar problems

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to PlayVerse! 🎮✨
