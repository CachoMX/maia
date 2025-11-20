#!/usr/bin/env python3
"""
MAIA Database Schema Deployment Script
Deploys the complete database schema to Supabase using REST API
"""

import os
import json
import urllib.request
import urllib.error
from pathlib import Path

# Configuration
PROJECT_ROOT = Path(__file__).parent.parent
ENV_FILE = PROJECT_ROOT / ".env.local"
MIGRATION_FILE = PROJECT_ROOT / "supabase" / "migrations" / "001_initial_schema.sql"

def load_env_file():
    """Load environment variables from .env.local"""
    env_vars = {}
    if ENV_FILE.exists():
        with open(ENV_FILE, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    env_vars[key] = value
    return env_vars

def execute_sql_via_rest(sql_query, service_role_key, supabase_url):
    """
    Execute SQL query via Supabase REST API
    Note: This requires creating a custom RPC function first
    """
    # Prepare the request
    url = f"{supabase_url}/rest/v1/rpc/exec_sql"
    headers = {
        'apikey': service_role_key,
        'Authorization': f'Bearer {service_role_key}',
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
    }

    data = json.dumps({
        'query': sql_query
    }).encode('utf-8')

    # Make the request
    request = urllib.request.Request(url, data=data, headers=headers, method='POST')

    try:
        with urllib.request.urlopen(request) as response:
            result = json.loads(response.read().decode('utf-8'))
            return True, result
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        return False, error_body
    except Exception as e:
        return False, str(e)

def deploy_schema():
    """Deploy the database schema to Supabase"""

    print("\n" + "="*70)
    print("MAIA DATABASE SCHEMA DEPLOYMENT")
    print("="*70)
    print(f"\nMigration File: {MIGRATION_FILE}")
    print("")

    # Check if migration file exists
    if not MIGRATION_FILE.exists():
        print(f"✗ Error: Migration file not found at {MIGRATION_FILE}")
        return False

    # Load environment variables
    env_vars = load_env_file()
    supabase_url = env_vars.get('NEXT_PUBLIC_SUPABASE_URL')
    service_role_key = env_vars.get('SUPABASE_SERVICE_ROLE_KEY')

    if not supabase_url or not service_role_key:
        print("✗ Error: Missing Supabase credentials in .env.local")
        print("  Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY")
        return False

    print(f"Supabase URL: {supabase_url}")
    print("")

    # Read SQL file
    print("Reading migration file...")
    with open(MIGRATION_FILE, 'r', encoding='utf-8') as f:
        sql_content = f.read()

    print(f"[OK] Migration file size: {len(sql_content)} characters")
    print("")

    # NOTE: The Supabase REST API doesn't directly support executing arbitrary SQL
    # We need to use the SQL Editor in the Supabase Dashboard OR use psycopg2

    print("="*70)
    print("DEPLOYMENT METHOD")
    print("="*70)
    print("\nThe Supabase REST API doesn't support direct SQL execution.")
    print("Please use ONE of these methods:\n")

    print("METHOD 1: Supabase SQL Editor (RECOMMENDED)")
    print("-" * 70)
    print("1. Go to: https://app.supabase.com/project/bexudrmrspbyhkcqrtse/sql/new")
    print("2. Copy the contents of this file:")
    print(f"   {MIGRATION_FILE}")
    print("3. Paste into the SQL Editor")
    print("4. Click 'Run' or press Ctrl+Enter")
    print("")

    print("METHOD 2: Using psycopg2 with Database Password")
    print("-" * 70)
    print("1. Get your database password from:")
    print("   https://app.supabase.com/project/bexudrmrspbyhkcqrtse/settings/database")
    print("2. Set environment variable:")
    print("   export SUPABASE_DB_PASSWORD='your_password'")
    print("3. Run the other deployment script:")
    print("   python scripts/deploy_schema.py")
    print("")

    print("METHOD 3: Using Supabase CLI")
    print("-" * 70)
    print("1. Install Supabase CLI:")
    print("   npm install -g supabase")
    print("2. Link to your project:")
    print("   supabase link --project-ref bexudrmrspbyhkcqrtse")
    print("3. Run migration:")
    print("   supabase db push")
    print("")

    # Copy SQL to clipboard if possible
    try:
        import pyperclip
        pyperclip.copy(sql_content)
        print("="*70)
        print("[OK] SQL COPIED TO CLIPBOARD!")
        print("="*70)
        print("The migration SQL has been copied to your clipboard.")
        print("Simply paste it into the Supabase SQL Editor and run it.")
        print("")
    except ImportError:
        print("="*70)
        print("TIP: Install pyperclip to auto-copy SQL to clipboard")
        print("="*70)
        print("pip install pyperclip")
        print("")

    return True

if __name__ == "__main__":
    success = deploy_schema()
    if success:
        print("\n" + "="*70)
        print("NEXT STEPS AFTER DEPLOYMENT")
        print("="*70)
        print("\n1. Verify all tables were created:")
        print("   https://app.supabase.com/project/bexudrmrspbyhkcqrtse/editor")
        print("\n2. Check RLS policies are active:")
        print("   https://app.supabase.com/project/bexudrmrspbyhkcqrtse/auth/policies")
        print("\n3. Test database functions:")
        print("   - get_staff_case_load()")
        print("   - get_weekly_action_items()")
        print("   - get_tier_distribution_by_grade()")
        print("\n4. Create initial test users in the auth.users table")
        print("\n5. Run verification queries to test foreign keys and constraints")
        print("")
