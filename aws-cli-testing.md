# AWS CLI Testing for Account Readiness Platform

## 🎯 Overview

This guide shows how to test the AWS Account Readiness Platform using AWS CLI commands instead of curl. This approach is more realistic for AWS-focused applications and provides better integration testing.

## 📋 Prerequisites

### 1. Install AWS CLI
```bash
# For Ubuntu/Linux
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# For macOS
brew install awscli

# For Windows
# Download and run AWS CLI MSI installer from AWS website
```

### 2. Configure AWS CLI
```bash
# Configure with your AWS credentials
aws configure

# You'll be prompted for:
# AWS Access Key ID: [Your Access Key]
# AWS Secret Access Key: [Your Secret Key]
# Default region name: [e.g., us-east-1]
# Default output format: [json]
```

### 3. Verify AWS CLI Setup
```bash
# Test basic AWS CLI functionality
aws sts get-caller-identity

# Expected output:
{
    "UserId": "AIDACKCEVSQ6C2EXAMPLE",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/username"
}
```

## 🔧 AWS CLI Integration Scripts

### 1. Create AWS CLI Test Script