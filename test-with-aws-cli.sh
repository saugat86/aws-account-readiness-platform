#!/bin/bash

# AWS Account Readiness Platform - AWS CLI Testing Script
# This script tests the platform using AWS CLI commands and real AWS account information

set -e  # Exit on any error

echo "🚀 AWS Account Readiness Platform - CLI Testing"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if jq is installed for JSON parsing
if ! command -v jq &> /dev/null; then
    echo -e "${YELLOW}⚠️  jq is not installed. Installing for better JSON parsing...${NC}"
    # Try to install jq
    if command -v apt-get &> /dev/null; then
        sudo apt-get update && sudo apt-get install -y jq
    elif command -v brew &> /dev/null; then
        brew install jq
    else
        echo -e "${RED}❌ Please install jq manually for better output formatting${NC}"
    fi
fi

echo -e "${BLUE}🔍 Step 1: Verifying AWS CLI Configuration${NC}"
echo "=============================================="

# Get AWS account information
AWS_ACCOUNT_INFO=$(aws sts get-caller-identity 2>/dev/null || echo "ERROR")

if [ "$AWS_ACCOUNT_INFO" = "ERROR" ]; then
    echo -e "${RED}❌ AWS CLI not configured properly. Run 'aws configure' first.${NC}"
    exit 1
fi

# Extract account information
AWS_ACCOUNT_ID=$(echo $AWS_ACCOUNT_INFO | jq -r '.Account' 2>/dev/null || echo "Unknown")
AWS_USER_ARN=$(echo $AWS_ACCOUNT_INFO | jq -r '.Arn' 2>/dev/null || echo "Unknown")
AWS_USER_ID=$(echo $AWS_ACCOUNT_INFO | jq -r '.UserId' 2>/dev/null || echo "Unknown")

echo -e "${GREEN}✅ AWS CLI configured successfully${NC}"
echo "   Account ID: $AWS_ACCOUNT_ID"
echo "   User ARN: $AWS_USER_ARN"
echo "   User ID: $AWS_USER_ID"
echo

# Get AWS region
AWS_REGION=$(aws configure get region 2>/dev/null || echo "us-east-1")
echo "   Default Region: $AWS_REGION"
echo

echo -e "${BLUE}🔍 Step 2: Gathering AWS Account Information${NC}"
echo "=============================================="

# Get account alias (if set)
ACCOUNT_ALIAS=$(aws iam list-account-aliases --query 'AccountAliases[0]' --output text 2>/dev/null || echo "None")
echo "   Account Alias: $ACCOUNT_ALIAS"

# Get account summary
echo -e "${YELLOW}📊 Account Summary:${NC}"
aws iam get-account-summary --query 'SummaryMap' --output table 2>/dev/null || echo "   Unable to retrieve account summary"

echo

echo -e "${BLUE}🔍 Step 3: Testing Readiness Platform with AWS Data${NC}"
echo "===================================================="

# Create business profile based on AWS account info
BUSINESS_PROFILE=$(cat <<EOF
{
  "businessProfile": {
    "companyName": "AWS Account ${AWS_ACCOUNT_ID}",
    "businessType": "corporation",
    "taxId": "12-${AWS_ACCOUNT_ID:0:7}",
    "website": "https://company-${AWS_ACCOUNT_ID}.com",
    "industry": "Technology",
    "description": "Cloud infrastructure and software development company utilizing AWS services for scalable business solutions"
  },
  "contactInfo": {
    "primaryEmail": "admin@company-${AWS_ACCOUNT_ID}.com",
    "businessPhone": "+1-555-${AWS_ACCOUNT_ID:0:3}-${AWS_ACCOUNT_ID:3:4}"
  },
  "paymentMethod": {
    "type": "business_credit",
    "isVerified": true,
    "riskScore": 15
  }
}
EOF
)

echo -e "${YELLOW}📝 Generated Business Profile:${NC}"
echo "$BUSINESS_PROFILE" | jq '.' 2>/dev/null || echo "$BUSINESS_PROFILE"
echo

# Test the scoring endpoint
echo -e "${BLUE}🧮 Step 4: Calculating Readiness Score${NC}"
echo "======================================"

SCORING_RESPONSE=$(curl -s -X POST http://localhost:3001/api/scoring/calculate \
  -H "Content-Type: application/json" \
  -d "$BUSINESS_PROFILE" 2>/dev/null || echo "ERROR")

if [ "$SCORING_RESPONSE" = "ERROR" ]; then
    echo -e "${RED}❌ Failed to connect to readiness platform. Is the server running on localhost:3001?${NC}"
    echo "   Start the server with: npm run dev"
    exit 1
fi

echo -e "${GREEN}✅ Readiness Score Calculated${NC}"
echo "$SCORING_RESPONSE" | jq '.' 2>/dev/null || echo "$SCORING_RESPONSE"
echo

# Extract and display score
OVERALL_SCORE=$(echo "$SCORING_RESPONSE" | jq -r '.data.overall' 2>/dev/null || echo "Unknown")
if [ "$OVERALL_SCORE" != "Unknown" ]; then
    SCORE_PERCENTAGE=$(echo "$OVERALL_SCORE * 100" | bc -l 2>/dev/null || echo "0")
    SCORE_PERCENTAGE=${SCORE_PERCENTAGE%.*}  # Remove decimal places
    
    echo -e "${YELLOW}📊 Overall Readiness Score: ${SCORE_PERCENTAGE}%${NC}"
    
    if [ "$SCORE_PERCENTAGE" -ge 90 ]; then
        echo -e "${GREEN}🎉 Excellent! Your AWS account profile is ready for creation.${NC}"
    elif [ "$SCORE_PERCENTAGE" -ge 80 ]; then
        echo -e "${YELLOW}👍 Good! Minor improvements recommended.${NC}"
    elif [ "$SCORE_PERCENTAGE" -ge 70 ]; then
        echo -e "${YELLOW}⚠️  Fair. Several improvements needed.${NC}"
    else
        echo -e "${RED}❌ Poor. Significant improvements required.${NC}"
    fi
fi

echo

# Test risk analysis
echo -e "${BLUE}🔍 Step 5: Risk Factor Analysis${NC}"
echo "==============================="

RISK_ANALYSIS_RESPONSE=$(curl -s -X POST http://localhost:3001/api/scoring/risk-analysis \
  -H "Content-Type: application/json" \
  -d "$BUSINESS_PROFILE" 2>/dev/null || echo "ERROR")

if [ "$RISK_ANALYSIS_RESPONSE" != "ERROR" ]; then
    echo -e "${GREEN}✅ Risk Analysis Completed${NC}"
    echo "$RISK_ANALYSIS_RESPONSE" | jq '.' 2>/dev/null || echo "$RISK_ANALYSIS_RESPONSE"
    
    # Count risk factors
    RISK_COUNT=$(echo "$RISK_ANALYSIS_RESPONSE" | jq '.data | length' 2>/dev/null || echo "0")
    echo
    echo -e "${YELLOW}📊 Risk Factors Found: $RISK_COUNT${NC}"
    
    if [ "$RISK_COUNT" -eq 0 ]; then
        echo -e "${GREEN}🎉 No risk factors detected!${NC}"
    else
        echo -e "${YELLOW}⚠️  Review and address identified risk factors${NC}"
    fi
else
    echo -e "${RED}❌ Risk analysis failed${NC}"
fi

echo

# AWS-specific recommendations
echo -e "${BLUE}🎯 Step 6: AWS-Specific Recommendations${NC}"
echo "======================================="

echo -e "${YELLOW}Based on your AWS account configuration:${NC}"
echo

# Check if account has MFA enabled
MFA_DEVICES=$(aws iam list-mfa-devices --query 'MFADevices' --output json 2>/dev/null || echo "[]")
MFA_COUNT=$(echo "$MFA_DEVICES" | jq 'length' 2>/dev/null || echo "0")

if [ "$MFA_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ MFA is enabled - Good security practice${NC}"
else
    echo -e "${YELLOW}⚠️  Consider enabling MFA for better security${NC}"
fi

# Check for IAM users (indicates business usage)
IAM_USERS=$(aws iam list-users --query 'Users' --output json 2>/dev/null || echo "[]")
USER_COUNT=$(echo "$IAM_USERS" | jq 'length' 2>/dev/null || echo "0")

if [ "$USER_COUNT" -gt 1 ]; then
    echo -e "${GREEN}✅ Multiple IAM users - Indicates business usage${NC}"
else
    echo -e "${YELLOW}⚠️  Consider creating IAM users for team members${NC}"
fi

# Check for active services (indicates legitimate usage)
echo -e "${BLUE}🔍 Checking active AWS services...${NC}"

# Check EC2 instances
EC2_INSTANCES=$(aws ec2 describe-instances --query 'Reservations[*].Instances[*].State.Name' --output text 2>/dev/null || echo "")
if [ -n "$EC2_INSTANCES" ]; then
    echo -e "${GREEN}✅ EC2 instances found - Active compute usage${NC}"
fi

# Check S3 buckets
S3_BUCKETS=$(aws s3 ls 2>/dev/null | wc -l || echo "0")
if [ "$S3_BUCKETS" -gt 0 ]; then
    echo -e "${GREEN}✅ S3 buckets found - Active storage usage${NC}"
fi

echo

echo -e "${BLUE}🎉 Step 7: Testing Complete${NC}"
echo "=========================="

echo -e "${GREEN}✅ AWS CLI integration test completed successfully!${NC}"
echo
echo -e "${YELLOW}Summary:${NC}"
echo "- AWS Account ID: $AWS_ACCOUNT_ID"
echo "- Readiness Score: ${SCORE_PERCENTAGE}%"
echo "- Risk Factors: $RISK_COUNT"
echo "- MFA Enabled: $([ "$MFA_COUNT" -gt 0 ] && echo "Yes" || echo "No")"
echo "- IAM Users: $USER_COUNT"
echo

echo -e "${BLUE}Next Steps:${NC}"
echo "1. Review the readiness score and recommendations"
echo "2. Address any identified risk factors"
echo "3. Complete missing documentation"
echo "4. Use the web interface at http://localhost:3000 for detailed analysis"

echo
echo -e "${GREEN}🚀 Ready to help businesses succeed with AWS!${NC}"