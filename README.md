# CRM v0 - Sales Lead-to-Order System

A role-based Sales Lead-to-Order system built with Next.js and Supabase.

## Features

- **Accounts Management**: Manage customer accounts
- **Opportunities**: Track sales opportunities through the pipeline
- **Quotes**: Create and manage quotes with approval workflow
- **Approvals**: Financial approval system for quotes
- **Handovers**: Sales to Operations handover process
- **Role-Based Access Control**: Enforced at the database level with RLS

## Roles

- **Executive**: Full access to all features
- **Sales**: Owns opportunities and deal value
- **Finance**: Owns cost, margin, and approvals
- **Operations**: Owns execution acceptance (limited visibility)

## Visibility Rules

Operations role has restricted visibility:
- ✅ Can see: deal value, scope, dates
- ❌ Cannot see: margin, cost, discounts, approval history

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **UI**: Tailwind CSS + shadcn/ui components
- **Backend**: Supabase (PostgreSQL + Row Level Security)
- **Auth**: Supabase Auth

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   
   Add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Set up the database:
   - Run `supabase/schema.sql` in your Supabase SQL editor
   - Run `supabase/rls-policies.sql` in your Supabase SQL editor

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Schema

The system uses the following core tables:
- `user_profiles` - User information and roles
- `accounts` - Customer accounts
- `opportunities` - Sales opportunities
- `quotes` - Quotes with financial details
- `approvals` - Approval workflow
- `handovers` - Sales to Operations handovers

## Workflows

### Opportunity States
```
lead → qualified → proposal → closed_won / closed_lost
```

### Quote States
```
draft → pending_approval → approved / rejected
```

### Handover States
```
pending → accepted / flagged
```

**Note**: No backward transitions are allowed after closure.

## Project Structure

```
├── app/                    # Next.js app router pages
├── components/             # React components
├── lib/                    # Utility functions
│   ├── supabase/          # Supabase client setup
│   ├── types/             # TypeScript types
│   └── auth.ts            # Authentication helpers
├── supabase/              # Database files
│   ├── schema.sql         # Database schema
│   └── rls-policies.sql   # Row Level Security policies
└── docs/                  # Project documentation
    └── plan.md            # Build plan and requirements
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Design Principles

- Encode decisions, not behavior
- Visibility ≠ authority
- Sales sells, Finance protects, Operations delivers
- Simplicity over completeness

## License

Private project

