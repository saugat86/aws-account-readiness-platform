#!/bin/bash

# GitHub Repository Setup Script for AWS Account Readiness Platform
# This script helps you initialize and push your project to GitHub

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 AWS Account Readiness Platform - GitHub Setup${NC}"
echo "=================================================="

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git is not installed. Please install Git first.${NC}"
    exit 1
fi

# Check if we're already in a git repository
if [ -d ".git" ]; then
    echo -e "${YELLOW}⚠️  Git repository already exists.${NC}"
    read -p "Do you want to continue? This will add a remote origin. (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Setup cancelled.${NC}"
        exit 0
    fi
else
    echo -e "${BLUE}📁 Initializing Git repository...${NC}"
    git init
    echo -e "${GREEN}✅ Git repository initialized${NC}"
fi

# Get repository name from user
echo
echo -e "${BLUE}📝 Repository Configuration${NC}"
echo "Suggested repository names:"
echo "1. aws-account-readiness-platform (Recommended)"
echo "2. aws-business-verification-toolkit"
echo "3. aws-account-approval-optimizer"
echo "4. cloud-account-readiness-suite"
echo "5. aws-compliance-readiness-platform"
echo

read -p "Enter your preferred repository name (or press Enter for default): " REPO_NAME
if [ -z "$REPO_NAME" ]; then
    REPO_NAME="aws-account-readiness-platform"
fi

echo -e "${GREEN}✅ Repository name: ${REPO_NAME}${NC}"

# Get GitHub username
read -p "Enter your GitHub username: " GITHUB_USERNAME
if [ -z "$GITHUB_USERNAME" ]; then
    echo -e "${RED}❌ GitHub username is required${NC}"
    exit 1
fi

echo -e "${GREEN}✅ GitHub username: ${GITHUB_USERNAME}${NC}"

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo -e "${BLUE}📄 Creating .gitignore...${NC}"
    # .gitignore content is already created by the previous command
    echo -e "${GREEN}✅ .gitignore created${NC}"
fi

# Add all files to git
echo -e "${BLUE}📦 Adding files to Git...${NC}"
git add .

# Check if there are any changes to commit
if git diff --staged --quiet; then
    echo -e "${YELLOW}⚠️  No changes to commit${NC}"
else
    # Commit the files
    echo -e "${BLUE}💾 Creating initial commit...${NC}"
    git commit -m "Initial commit: AWS Account Readiness Platform

Features:
- Intelligent scoring algorithm for AWS account readiness
- Business profile optimization and validation
- Risk factor analysis and recommendations
- React frontend with Tailwind CSS
- Node.js backend with Express API
- TypeScript shared utilities
- Comprehensive testing suite
- AWS CLI integration testing
- Professional documentation

This platform helps legitimate businesses successfully create AWS accounts
by identifying and addressing potential approval issues proactively."

    echo -e "${GREEN}✅ Initial commit created${NC}"
fi

# Set up remote origin
REPO_URL="https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"
echo -e "${BLUE}🔗 Setting up remote origin...${NC}"

# Check if origin already exists
if git remote get-url origin &> /dev/null; then
    echo -e "${YELLOW}⚠️  Remote origin already exists. Updating...${NC}"
    git remote set-url origin "$REPO_URL"
else
    git remote add origin "$REPO_URL"
fi

echo -e "${GREEN}✅ Remote origin set to: ${REPO_URL}${NC}"

# Set default branch to main
echo -e "${BLUE}🌿 Setting default branch to main...${NC}"
git branch -M main
echo -e "${GREEN}✅ Default branch set to main${NC}"

echo
echo -e "${BLUE}🎯 Next Steps:${NC}"
echo "=============="
echo
echo "1. Create the repository on GitHub:"
echo -e "   ${YELLOW}https://github.com/new${NC}"
echo "   - Repository name: ${REPO_NAME}"
echo "   - Description: AWS Account Readiness Platform - Help businesses succeed with AWS account creation"
echo "   - Make it Public (recommended for open source)"
echo "   - Don't initialize with README (we already have one)"
echo
echo "2. After creating the repository on GitHub, run:"
echo -e "   ${GREEN}git push -u origin main${NC}"
echo
echo "3. Optional: Set up GitHub Pages for documentation:"
echo "   - Go to repository Settings > Pages"
echo "   - Source: Deploy from a branch"
echo "   - Branch: main / docs"
echo
echo "4. Consider adding these GitHub repository settings:"
echo "   - Topics: aws, account-management, business-tools, typescript, react"
echo "   - Website: Your deployed application URL"
echo "   - Issues: Enable for bug reports and feature requests"
echo "   - Discussions: Enable for community support"
echo
echo -e "${GREEN}🎉 Git repository setup complete!${NC}"
echo
echo -e "${YELLOW}Repository URL: ${REPO_URL}${NC}"
echo -e "${YELLOW}Don't forget to create the repository on GitHub before pushing!${NC}"