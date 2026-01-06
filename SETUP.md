# Setup Guide

## Initial Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Create a new Supabase project at https://supabase.com
2. Copy your project URL and anon key
3. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Set Up Database

1. Open your Supabase project dashboard
2. Go to SQL Editor
3. Run the schema file:
   - Copy and paste the contents of `supabase/schema.sql`
   - Execute the SQL
4. Run the RLS policies file:
   - Copy and paste the contents of `supabase/rls-policies.sql`
   - Execute the SQL

### 4. Create Initial User

After setting up the database, you'll need to:

1. Enable email authentication in Supabase Auth settings
2. Create a user through Supabase Auth
3. Insert a corresponding record in `user_profiles` table:

```sql
INSERT INTO user_profiles (id, email, full_name, role)
VALUES (
  'user-uuid-from-auth',
  'user@example.com',
  'John Doe',
  'executive' -- or 'sales', 'finance', 'operations'
);
```

### 5. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Next Steps

After initial setup, you can:

1. Build out the UI pages for each entity (Accounts, Opportunities, Quotes, etc.)
2. Create server actions for data mutations
3. Implement state transition validation
4. Add role-based UI components
5. Build responsive layouts

## Database Notes

- All tables have Row Level Security (RLS) enabled
- Operations role has restricted visibility (see `quotes_for_operations` view)
- State transitions are enforced at the application level
- Use the helper functions in `lib/auth.ts` for role checks

