# AWS Account Readiness Platform

A comprehensive platform to help legitimate businesses successfully create and maintain AWS accounts by ensuring compliance with AWS verification requirements.

## 🎯 Overview

The AWS Account Readiness Platform uses intelligent scoring algorithms to evaluate business profiles and identify potential issues before AWS account creation. This proactive approach significantly reduces account suspension risks and improves approval rates.

## ✨ Key Features

### 🔍 Pre-Flight Verification Checker
- Payment method validation (business vs. prepaid cards)
- Email domain reputation analysis
- Business registration document verification
- Phone number validation
- Identity document scanning

### 📋 Documentation Preparation Assistant
- Business license collection workflow
- Tax ID/EIN verification
- Company registration documents
- Domain ownership proof
- Cloud provider reference validation

### 📊 Profile Optimization
- Business information completeness scoring
- Contact information validation
- Billing address verification
- Usage intent documentation

### ⚠️ Risk Factor Analysis
- VPN/proxy detection during signup
- Geographic information consistency checks
- Payment method strength assessment
- Business profile completeness validation
- Professional email requirement enforcement

### 📝 Appeal Management System
- Suspension appeal tracking
- Document organization
- Professional appeal letter templates
- Case status monitoring

### 📈 Compliance Dashboard
- Account health monitoring
- Spending pattern analysis
- Security best practices checklist
- Unusual activity alerts

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Shared Types  │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (TypeScript)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Tailwind CSS  │    │   Express.js    │    │   Validation    │
│   Components    │    │   REST API      │    │   Utilities     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/aws-account-readiness-platform.git
cd aws-account-readiness-platform

# Install dependencies
npm install

# Build shared package
npm run build:shared

# Start development servers
npm run dev
```

### Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 🧪 Testing

### Basic Testing
```bash
# Test the scoring system
npm run test:scoring

# Start both servers
npm run dev
```

### AWS CLI Integration Testing
```bash
# Configure AWS CLI first
aws configure

# Run AWS CLI integration test
chmod +x test-with-aws-cli.sh
./test-with-aws-cli.sh

# Or use Node.js AWS SDK test
npm install aws-sdk axios
node aws-integration-test.js
```

### API Testing
```bash
# Test scoring endpoint
curl -X POST http://localhost:3001/api/scoring/calculate \
  -H "Content-Type: application/json" \
  -d '{"businessProfile":{"companyName":"Test Co","businessType":"llc"}}'

# Test risk analysis
curl -X POST http://localhost:3001/api/scoring/risk-analysis \
  -H "Content-Type: application/json" \
  -d '{"contactInfo":{"primaryEmail":"test@gmail.com"}}'
```

## 📊 Scoring Algorithm

The platform uses a weighted scoring system:

- **Business Profile** (25%): Company information completeness
- **Payment Method** (25%): Payment method quality and verification
- **Contact Information** (20%): Professional email and phone validation
- **Documentation** (20%): Required document verification status
- **Risk Factors** (10%): Potential red flags and compliance issues

### Score Ranges
- **90-100%**: Excellent - Very high approval probability
- **80-89%**: Good - High approval probability
- **70-79%**: Fair - Moderate approval probability
- **60-69%**: Poor - Low approval probability
- **Below 60%**: Critical - Very low approval probability

## 📁 Project Structure

```
/
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   └── App.tsx       # Main application
│   └── package.json
├── backend/               # Node.js API server
│   ├── src/
│   │   ├── routes/       # API routes
│   │   └── index.ts      # Server entry point
│   └── package.json
├── shared/                # Shared types and utilities
│   ├── src/
│   │   ├── types/        # TypeScript interfaces
│   │   └── utils/        # Validation and scoring logic
│   └── package.json
├── docs/                  # Documentation
│   ├── TESTING.md        # Testing guide
│   ├── SCORING_MECHANISM.md  # Scoring algorithm details
│   └── AWS_ACCOUNT_GUIDELINES.md  # AWS best practices
└── test-standalone.html   # Standalone demo
```

## 🔧 Configuration

### Environment Variables
```bash
# Backend (.env)
PORT=3001
NODE_ENV=development
JWT_SECRET=your-jwt-secret
DATABASE_URL=postgresql://localhost:5432/aws_readiness
```

### AWS CLI Configuration
```bash
# Configure AWS credentials for testing
aws configure
```

## 📚 Documentation

- **[Testing Guide](TESTING.md)** - Comprehensive testing instructions
- **[Scoring Mechanism](SCORING_MECHANISM.md)** - Detailed scoring algorithm explanation
- **[AWS Guidelines](AWS_ACCOUNT_GUIDELINES.md)** - Best practices for AWS account creation
- **[API Documentation](docs/api.md)** - REST API reference

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🛡️ Security

This platform is designed to help legitimate businesses succeed with AWS account creation. It does not and will not assist with:
- Document fraud or falsification
- Identity misrepresentation
- Circumventing AWS security measures
- Any illegal or unethical activities

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/aws-account-readiness-platform/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/aws-account-readiness-platform/discussions)
- **Documentation**: [Wiki](https://github.com/yourusername/aws-account-readiness-platform/wiki)

## 🎯 Roadmap

- [ ] Database integration (PostgreSQL)
- [ ] User authentication system
- [ ] Document upload and verification
- [ ] Payment method validation with Stripe
- [ ] Business verification API integrations
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Mobile application

## ⭐ Show Your Support

If this project helps you, please consider giving it a star on GitHub!

---

**Built with ❤️ for legitimate businesses seeking AWS success**