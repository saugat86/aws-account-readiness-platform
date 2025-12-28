# Testing Guide for AWS Account Readiness Platform

## Prerequisites

Make sure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- Git

## Step-by-Step Testing Instructions

### 1. Install Dependencies

```bash
# Install root dependencies and workspace dependencies
npm install
```

### 2. Build Shared Package

The shared package contains common types and utilities used by both frontend and backend:

```bash
# Build the shared package first
cd shared
npm run build
cd ..
```

### 3. Test the Scoring System (Standalone)

Before running the full application, let's test the core scoring functionality:

```bash
# Run the scoring test script
node test-scoring.js
```

You should see output like:
```
Testing AWS Account Readiness Scoring System...

✅ Scoring calculation successful!

📊 Results:
Overall Score: 85%

📋 Category Breakdown:
  businessProfile: 90%
  documentation: 50%
  paymentMethod: 94%
  contactInfo: 100%
  riskFactors: 100%

💡 Recommendations:
  1. Upload and verify all required business documents

🎉 Test completed successfully!
```

### 4. Start the Backend Server

```bash
# Start the backend development server
cd backend
npm run dev
```

The backend should start on port 3001. You should see:
```
Server running on port 3001
```

### 5. Test Backend API Endpoints

Open a new terminal and test the API endpoints:

```bash
# Test health check
curl http://localhost:3001/health

# Test scoring endpoint
curl -X POST http://localhost:3001/api/scoring/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "businessProfile": {
      "companyName": "Test Company",
      "businessType": "llc",
      "taxId": "12-3456789",
      "website": "https://test.com"
    },
    "contactInfo": {
      "primaryEmail": "admin@test.com",
      "businessPhone": "+1-555-123-4567"
    },
    "paymentMethod": {
      "type": "business_credit",
      "isVerified": true,
      "riskScore": 20
    }
  }'
```

### 6. Start the Frontend Application

Open another terminal:

```bash
# Start the frontend development server
cd frontend
npm run dev
```

The frontend should start on port 3000. You should see:
```
Local:   http://localhost:3000/
```

### 7. Test the Frontend

1. Open your browser and go to `http://localhost:3000`
2. You should see the AWS Account Readiness Platform dashboard
3. The page should display a readiness score with:
   - Overall score percentage
   - Category breakdowns (Business Profile, Documentation, etc.)
   - Recommendations list

### 8. Test Both Servers Together

```bash
# From the root directory, start both servers simultaneously
npm run dev
```

This will start both frontend and backend servers at once.

## AWS CLI Testing (Alternative to curl)

For a more AWS-native testing experience, you can use AWS CLI integration:

### Quick AWS CLI Test
```bash
# Make the script executable and run
chmod +x test-with-aws-cli.sh
./test-with-aws-cli.sh
```

### Node.js AWS SDK Test
```bash
# Install AWS SDK dependencies
npm install aws-sdk axios

# Run comprehensive AWS integration test
node aws-integration-test.js
```

### What AWS CLI Testing Provides
- **Real AWS Account Data**: Uses your actual AWS account information
- **Service Usage Analysis**: Checks EC2, S3, IAM usage patterns
- **Security Assessment**: Verifies MFA, IAM user setup
- **Comprehensive Reporting**: Detailed analysis with AWS-specific insights

## API Testing with curl

### Test Risk Analysis Endpoint

```bash
curl -X POST http://localhost:3001/api/scoring/risk-analysis \
  -H "Content-Type: application/json" \
  -d '{
    "businessProfile": {
      "companyName": "Test Company"
    },
    "contactInfo": {
      "primaryEmail": "test@gmail.com"
    },
    "paymentMethod": {
      "type": "prepaid"
    }
  }'
```

Expected response should include risk factors for using Gmail and prepaid card.

## Troubleshooting

### Common Issues

1. **"Cannot find module" errors**
   ```bash
   # Make sure to build the shared package first
   cd shared && npm run build
   ```

2. **Port already in use**
   ```bash
   # Kill processes on ports 3000 and 3001
   npx kill-port 3000 3001
   ```

3. **TypeScript compilation errors**
   ```bash
   # Clean and rebuild
   rm -rf */dist */node_modules
   npm install
   cd shared && npm run build
   ```

4. **Frontend not loading**
   - Check that both servers are running
   - Verify the proxy configuration in `frontend/vite.config.ts`
   - Check browser console for errors

## Expected Test Results

### Successful Frontend Test
- ✅ Page loads without errors
- ✅ Readiness score displays (should show ~75%)
- ✅ Category scores show different percentages
- ✅ Recommendations list appears
- ✅ Responsive design works on different screen sizes

### Successful Backend Test
- ✅ Health endpoint returns `{"status": "OK"}`
- ✅ Scoring endpoint returns calculated scores
- ✅ Risk analysis endpoint identifies risk factors
- ✅ No console errors in server logs

## Next Steps After Testing

Once basic testing is complete, you can:

1. **Add a database** (PostgreSQL) for data persistence
2. **Implement user authentication** 
3. **Add file upload functionality** for documents
4. **Integrate payment method validation** with Stripe
5. **Add business verification APIs**
6. **Create additional frontend pages** (profile setup, document upload, etc.)

## Performance Testing

For load testing the API:

```bash
# Install artillery for load testing
npm install -g artillery

# Create a simple load test
echo 'config:
  target: "http://localhost:3001"
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "Health check"
    requests:
      - get:
          url: "/health"' > load-test.yml

# Run load test
artillery run load-test.yml
```