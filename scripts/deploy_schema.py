#!/usr/bin/env python3
"""
MAIA Database Schema Deployment Script
Deploys the complete database schema to Supabase using psycopg2
"""

import os
import sys
from pathlib import Path

try:
    import psycopg2
    from psycopg2 import sql
except ImportError:
    print("Error: psycopg2 not installed. Installing now...")
    os.system("pip install psycopg2-binary")
    import psycopg2
    from psycopg2 import sql

# Configuration
PROJECT_ROOT = Path(__file__).parent.parent
ENV_FILE = PROJECT_ROOT / ".env.local"
MIGRATION_FILE = PROJECT_ROOT / "supabase" / "migrations" / "001_initial_schema.sql"

# Supabase connection details
SUPABASE_PROJECT_REF = "bexudrmrspbyhkcqrtse"
SUPABASE_DB_PASSWORD = None  # Will need to be set

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

def get_connection_string():
    """
    Get Supabase database connection string.
    Format: postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
    """
    env_vars = load_env_file()

    # Try to get password from environment
    password = os.environ.get('SUPABASE_DB_PASSWORD') or os.environ.get('DB_PASSWORD')

    if not password:
        print("\n" + "="*60)
        print("SUPABASE DATABASE PASSWORD REQUIRED")
        print("="*60)
        print("\nTo get your database password:")
        print("1. Go to https://app.supabase.com/project/bexudrmrspbyhkcqrtse/settings/database")
        print("2. Copy the Database Password")
        print("3. Either:")
        print("   - Set environment variable: export SUPABASE_DB_PASSWORD='your_password'")
        print("   - Or enter it below when prompted")
        print("")
        password = input("Enter Supabase Database Password: ").strip()

        if not password:
            print("Error: Password required to connect to database")
            sys.exit(1)

    connection_string = f"postgresql://postgres.{SUPABASE_PROJECT_REF}:{password}@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
    return connection_string

def deploy_schema():
    """Deploy the database schema to Supabase"""

    print("\n" + "="*60)
    print("MAIA DATABASE SCHEMA DEPLOYMENT")
    print("="*60)
    print(f"\nProject: {SUPABASE_PROJECT_REF}")
    print(f"Migration File: {MIGRATION_FILE}")
    print("")

    # Check if migration file exists
    if not MIGRATION_FILE.exists():
        print(f"Error: Migration file not found at {MIGRATION_FILE}")
        sys.exit(1)

    # Read SQL file
    print("Reading migration file...")
    with open(MIGRATION_FILE, 'r', encoding='utf-8') as f:
        sql_content = f.read()

    print(f"Migration file size: {len(sql_content)} characters")
    print("")

    # Get connection string
    connection_string = get_connection_string()

    # Connect to database
    print("Connecting to Supabase database...")
    try:
        conn = psycopg2.connect(connection_string)
        conn.autocommit = False
        cursor = conn.cursor()
        print("✓ Connected successfully")
        print("")
    except Exception as e:
        print(f"✗ Connection failed: {e}")
        print("\nTroubleshooting:")
        print("1. Check your database password")
        print("2. Ensure your IP is whitelisted in Supabase")
        print("3. Verify the project reference is correct")
        sys.exit(1)

    # Execute migration
    try:
        print("Deploying schema...")
        print("-" * 60)

        # Execute the SQL
        cursor.execute(sql_content)

        # Commit the transaction
        conn.commit()

        print("")
        print("✓ Schema deployed successfully!")
        print("")

        # Get table count
        cursor.execute("""
            SELECT COUNT(*)
            FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_type = 'BASE TABLE'
        """)
        table_count = cursor.fetchone()[0]

        print(f"Total tables in public schema: {table_count}")

        # List all tables
        cursor.execute("""
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_type = 'BASE TABLE'
            ORDER BY table_name
        """)
        tables = cursor.fetchall()

        print("\nTables created:")
        for table in tables:
            print(f"  - {table[0]}")

        # Get RLS status
        print("\nRow Level Security (RLS) Status:")
        cursor.execute("""
            SELECT tablename, rowsecurity
            FROM pg_tables
            WHERE schemaname = 'public'
            ORDER BY tablename
        """)
        rls_status = cursor.fetchall()

        for table, rls_enabled in rls_status:
            status = "✓ ENABLED" if rls_enabled else "✗ DISABLED"
            print(f"  {table}: {status}")

        # Get policy count
        cursor.execute("""
            SELECT COUNT(*)
            FROM pg_policies
            WHERE schemaname = 'public'
        """)
        policy_count = cursor.fetchone()[0]
        print(f"\nTotal RLS policies created: {policy_count}")

        # Get index count
        cursor.execute("""
            SELECT COUNT(*)
            FROM pg_indexes
            WHERE schemaname = 'public'
        """)
        index_count = cursor.fetchone()[0]
        print(f"Total indexes created: {index_count}")

        # Get function count
        cursor.execute("""
            SELECT COUNT(*)
            FROM information_schema.routines
            WHERE routine_schema = 'public'
            AND routine_type = 'FUNCTION'
        """)
        function_count = cursor.fetchone()[0]
        print(f"Total helper functions created: {function_count}")

    except Exception as e:
        print(f"\n✗ Deployment failed: {e}")
        print("\nRolling back changes...")
        conn.rollback()
        sys.exit(1)
    finally:
        cursor.close()
        conn.close()

    print("\n" + "="*60)
    print("DEPLOYMENT COMPLETE!")
    print("="*60)
    print("\nNext steps:")
    print("1. Verify tables in Supabase Dashboard:")
    print("   https://app.supabase.com/project/bexudrmrspbyhkcqrtse/editor")
    print("2. Test RLS policies with different user roles")
    print("3. Create initial test users")
    print("4. Test database functions")
    print("")

if __name__ == "__main__":
    deploy_schema()
