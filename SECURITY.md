# Security Policy

## Supported Versions

We actively maintain and provide security updates for the latest version of Deep Tech Hunter.

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **Do not** open a public issue
2. Email us at [security@example.com] with details
3. Include steps to reproduce the vulnerability
4. We will respond within 48 hours

## Security Best Practices

### API Key Security
- Never commit API keys to version control
- Use environment variables (`.env.local`) for sensitive data
- Rotate API keys regularly

### Data Privacy
- This application processes research data locally
- No user data is stored on external servers
- API calls are made directly to Google Gemini

### Dependencies
- We regularly update dependencies to patch security vulnerabilities
- Use `npm audit` to check for known vulnerabilities
- Report any dependency security issues

## Responsible Disclosure

We appreciate security researchers who help keep our project safe. We will:

- Acknowledge your contribution
- Work with you to understand and fix the issue
- Credit you in our security acknowledgments (if desired)

Thank you for helping keep Deep Tech Hunter secure!