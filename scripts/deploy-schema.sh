#!/bin/bash
# MAIA Database Schema Deployment Script
# This script deploys the complete database schema to Supabase

set -e

# Load environment variables
if [ -f .env.local ]; then
  export $(cat .env.local | grep -v '^#' | xargs)
fi

# Configuration
SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL}"
SERVICE_ROLE_KEY="${SUPABASE_SERVICE_ROLE_KEY}"
MIGRATION_FILE="supabase/migrations/001_initial_schema.sql"

echo "========================================="
echo "MAIA Database Schema Deployment"
echo "========================================="
echo "Supabase URL: ${SUPABASE_URL}"
echo "Migration File: ${MIGRATION_FILE}"
echo ""

# Check if migration file exists
if [ ! -f "$MIGRATION_FILE" ]; then
  echo "Error: Migration file not found at $MIGRATION_FILE"
  exit 1
fi

# Read SQL file
SQL_CONTENT=$(cat "$MIGRATION_FILE")

# Deploy using Supabase REST API
echo "Deploying schema to Supabase..."
echo ""

# Execute the SQL via Supabase REST API
RESPONSE=$(curl -s -X POST \
  "${SUPABASE_URL}/rest/v1/rpc/exec_sql" \
  -H "apikey: ${SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -d "{\"query\": $(echo "$SQL_CONTENT" | jq -Rs .)}")

echo "Response: $RESPONSE"

echo ""
echo "========================================="
echo "Deployment Complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Verify tables in Supabase Dashboard"
echo "2. Test RLS policies"
echo "3. Create initial test users"
echo ""
