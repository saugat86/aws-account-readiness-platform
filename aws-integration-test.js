#!/usr/bin/env node

/**
 * AWS Account Readiness Platform - Node.js AWS SDK Integration Test
 * This script uses the AWS SDK to gather real account information and test the platform
 */

const AWS = require('aws-sdk');
const axios = require('axios');

// Configure AWS SDK
AWS.config.update({
  region: process.env.AWS_REGION || 'us-east-1'
});

const sts = new AWS.STS();
const iam = new AWS.IAM();
const ec2 = new AWS.EC2();
const s3 = new AWS.S3();

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function getAWSAccountInfo() {
  try {
    log('blue', '🔍 Gathering AWS Account Information...');
    
    // Get caller identity
    const identity = await sts.getCallerIdentity().promise();
    
    // Get account summary
    let accountSummary = {};
    try {
      const summary = await iam.getAccountSummary().promise();
      accountSummary = summary.SummaryMap;
    } catch (error) {
      log('yellow', '⚠️  Could not retrieve account summary (limited permissions)');
    }

    // Get account alias
    let accountAlias = 'None';
    try {
      const aliases = await iam.listAccountAliases().promise();
      accountAlias = aliases.AccountAliases[0] || 'None';
    } catch (error) {
      log('yellow', '⚠️  Could not retrieve account alias');
    }

    // Check MFA devices
    let mfaDevices = [];
    try {
      const mfa = await iam.listMFADevices().promise();
      mfaDevices = mfa.MFADevices;
    } catch (error) {
      log('yellow', '⚠️  Could not check MFA devices');
    }

    // Check IAM users
    let iamUsers = [];
    try {
      const users = await iam.listUsers().promise();
      iamUsers = users.Users;
    } catch (error) {
      log('yellow', '⚠️  Could not list IAM users');
    }

    return {
      accountId: identity.Account,
      userArn: identity.Arn,
      userId: identity.UserId,
      accountAlias,
      accountSummary,
      mfaDevices,
      iamUsers
    };
  } catch (error) {
    log('red', `❌ Error gathering AWS account info: ${error.message}`);
    throw error;
  }
}

async function checkAWSServices(accountInfo) {
  log('blue', '🔍 Checking Active AWS Services...');
  
  const services = {
    ec2Instances: 0,
    s3Buckets: 0,
    activeRegions: []
  };

  try {
    // Check EC2 instances
    const ec2Response = await ec2.describeInstances().promise();
    services.ec2Instances = ec2Response.Reservations.reduce((count, reservation) => {
      return count + reservation.Instances.length;
    }, 0);
  } catch (error) {
    log('yellow', '⚠️  Could not check EC2 instances');
  }

  try {
    // Check S3 buckets
    const s3Response = await s3.listBuckets().promise();
    services.s3Buckets = s3Response.Buckets.length;
  } catch (error) {
    log('yellow', '⚠️  Could not check S3 buckets');
  }

  return services;
}

function generateBusinessProfile(accountInfo, services) {
  const accountId = accountInfo.accountId;
  
  return {
    businessProfile: {
      companyName: `AWS Business ${accountId}`,
      businessType: 'corporation',
      taxId: `12-${accountId.substring(0, 7)}`,
      website: `https://business-${accountId}.com`,
      industry: 'Technology',
      description: 'Cloud-first technology company leveraging AWS infrastructure for scalable business solutions and digital transformation services'
    },
    contactInfo: {
      primaryEmail: `admin@business-${accountId}.com`,
      businessPhone: `+1-555-${accountId.substring(0, 3)}-${accountId.substring(3, 7)}`
    },
    paymentMethod: {
      type: 'business_credit',
      isVerified: true,
      riskScore: 10
    },
    awsMetadata: {
      accountId: accountInfo.accountId,
      accountAlias: accountInfo.accountAlias,
      mfaEnabled: accountInfo.mfaDevices.length > 0,
      iamUserCount: accountInfo.iamUsers.length,
      ec2Instances: services.ec2Instances,
      s3Buckets: services.s3Buckets,
      userArn: accountInfo.userArn
    }
  };
}

async function testReadinessPlatform(businessProfile) {
  const baseUrl = 'http://localhost:3001/api';
  
  try {
    log('blue', '🧮 Testing Readiness Platform...');
    
    // Test scoring endpoint
    const scoringResponse = await axios.post(`${baseUrl}/scoring/calculate`, businessProfile, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    log('green', '✅ Scoring calculation successful');
    console.log(JSON.stringify(scoringResponse.data, null, 2));
    
    // Test risk analysis
    const riskResponse = await axios.post(`${baseUrl}/scoring/risk-analysis`, businessProfile, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    log('green', '✅ Risk analysis successful');
    console.log(JSON.stringify(riskResponse.data, null, 2));
    
    return {
      scoring: scoringResponse.data,
      riskAnalysis: riskResponse.data
    };
    
  } catch (error) {
    log('red', `❌ Platform testing failed: ${error.message}`);
    if (error.code === 'ECONNREFUSED') {
      log('yellow', '💡 Make sure the platform server is running: npm run dev');
    }
    throw error;
  }
}

function analyzeResults(accountInfo, services, platformResults) {
  log('blue', '📊 Analyzing Results...');
  
  const score = platformResults.scoring.data;
  const risks = platformResults.riskAnalysis.data;
  
  console.log('\n' + '='.repeat(50));
  log('cyan', '📋 AWS ACCOUNT READINESS REPORT');
  console.log('='.repeat(50));
  
  // Account Information
  log('yellow', '\n🏢 AWS Account Information:');
  console.log(`   Account ID: ${accountInfo.accountId}`);
  console.log(`   Account Alias: ${accountInfo.accountAlias}`);
  console.log(`   User ARN: ${accountInfo.userArn}`);
  console.log(`   MFA Enabled: ${accountInfo.mfaDevices.length > 0 ? 'Yes' : 'No'}`);
  console.log(`   IAM Users: ${accountInfo.iamUsers.length}`);
  
  // Service Usage
  log('yellow', '\n☁️  AWS Service Usage:');
  console.log(`   EC2 Instances: ${services.ec2Instances}`);
  console.log(`   S3 Buckets: ${services.s3Buckets}`);
  
  // Readiness Score
  log('yellow', '\n📊 Readiness Score Analysis:');
  const overallScore = Math.round(score.overall * 100);
  console.log(`   Overall Score: ${overallScore}%`);
  
  if (overallScore >= 90) {
    log('green', '   Status: Excellent - Ready for AWS account creation');
  } else if (overallScore >= 80) {
    log('yellow', '   Status: Good - Minor improvements recommended');
  } else if (overallScore >= 70) {
    log('yellow', '   Status: Fair - Several improvements needed');
  } else {
    log('red', '   Status: Poor - Significant improvements required');
  }
  
  // Category Breakdown
  log('yellow', '\n📈 Category Scores:');
  Object.entries(score.categories).forEach(([category, value]) => {
    const percentage = Math.round(value * 100);
    const status = percentage >= 80 ? '✅' : percentage >= 60 ? '⚠️' : '❌';
    console.log(`   ${status} ${category}: ${percentage}%`);
  });
  
  // Risk Factors
  log('yellow', '\n⚠️  Risk Factors:');
  if (risks.length === 0) {
    log('green', '   ✅ No risk factors detected');
  } else {
    risks.forEach(risk => {
      const severity = risk.severity === 'high' ? '🔴' : risk.severity === 'medium' ? '🟡' : '🟢';
      console.log(`   ${severity} ${risk.type}: ${risk.description}`);
      console.log(`      💡 ${risk.recommendation}`);
    });
  }
  
  // Recommendations
  if (score.recommendations && score.recommendations.length > 0) {
    log('yellow', '\n💡 Recommendations:');
    score.recommendations.forEach((rec, index) => {
      console.log(`   ${index + 1}. ${rec}`);
    });
  }
  
  // AWS-Specific Insights
  log('yellow', '\n🎯 AWS-Specific Insights:');
  
  if (accountInfo.mfaDevices.length > 0) {
    log('green', '   ✅ MFA enabled - Shows security consciousness');
  } else {
    log('yellow', '   ⚠️  Enable MFA for better security posture');
  }
  
  if (accountInfo.iamUsers.length > 1) {
    log('green', '   ✅ Multiple IAM users - Indicates business usage');
  } else {
    log('yellow', '   💡 Consider creating IAM users for team members');
  }
  
  if (services.ec2Instances > 0 || services.s3Buckets > 0) {
    log('green', '   ✅ Active AWS service usage - Shows legitimate business activity');
  } else {
    log('yellow', '   💡 Consider demonstrating legitimate AWS usage patterns');
  }
  
  console.log('\n' + '='.repeat(50));
  log('green', '🎉 Analysis Complete!');
  console.log('='.repeat(50));
}

async function main() {
  try {
    log('cyan', '🚀 AWS Account Readiness Platform - AWS SDK Integration Test');
    log('cyan', '============================================================\n');
    
    // Step 1: Get AWS account information
    const accountInfo = await getAWSAccountInfo();
    log('green', '✅ AWS account information gathered successfully\n');
    
    // Step 2: Check AWS services
    const services = await checkAWSServices(accountInfo);
    log('green', '✅ AWS services checked successfully\n');
    
    // Step 3: Generate business profile
    const businessProfile = generateBusinessProfile(accountInfo, services);
    log('green', '✅ Business profile generated from AWS data\n');
    
    // Step 4: Test the readiness platform
    const platformResults = await testReadinessPlatform(businessProfile);
    log('green', '✅ Platform testing completed successfully\n');
    
    // Step 5: Analyze and display results
    analyzeResults(accountInfo, services, platformResults);
    
  } catch (error) {
    log('red', `\n❌ Test failed: ${error.message}`);
    
    if (error.code === 'CredentialsError' || error.code === 'UnauthorizedOperation') {
      log('yellow', '\n💡 AWS Credentials Issue:');
      console.log('   1. Run: aws configure');
      console.log('   2. Ensure your AWS credentials have appropriate permissions');
      console.log('   3. Check your AWS region configuration');
    }
    
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  main();
}

module.exports = {
  getAWSAccountInfo,
  checkAWSServices,
  generateBusinessProfile,
  testReadinessPlatform,
  analyzeResults
};