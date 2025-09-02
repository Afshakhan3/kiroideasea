# IdeaSea - Idea Sharing Platform

A Next.js platform where entrepreneurs can share their ideas through short videos and connect with potential investors.

## Features

### User Roles
- **Idea Givers**: Submit ideas with video presentations
- **Investors**: Browse ideas and initiate conversations

### Payment Plans (Gumroad Integration)
- **Single Idea**: $1 per idea submission
- **Unlimited Ideas**: $10 for 5 years of unlimited submissions
- **Investor Access**: $10 for 5 years of browsing and messaging

### Core Functionality
- Public idea browsing (no login required)
- Video-based idea presentations
- Like and comment system
- Direct messaging between investors and idea givers
- User dashboards for managing ideas and messages

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (for videos)
- **Payments**: Gumroad API with webhooks
- **Styling**: Tailwind CSS

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd ideasea
npm install
```

### 2. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `GUMROAD_WEBHOOK_SECRET`: Your Gumroad webhook secret
- `NEXT_PUBLIC_GUMROAD_*_URL`: Your Gumroad product URLs

### 3. Database Setup

1. Create a new Supabase project
2. Run the SQL files in order in your Supabase SQL editor:
   - `database/01-tables.sql` - Creates all tables
   - `database/02-rls.sql` - Enables Row Level Security
   - `database/03-policies.sql` - Creates security policies
   - `database/05-indexes.sql` - Creates performance indexes
3. Create a storage bucket:
   - Go to Supabase Storage section
   - Create a new bucket named `idea-videos`
   - Make it public
4. Run `database/04-storage.sql` for storage policies

### 4. Gumroad Setup

1. Create three products in Gumroad:
   - Single Idea ($1)
   - Unlimited Ideas ($10)
   - Investor Access ($10)

2. Set up webhooks in Gumroad pointing to:
   ```
   https://yourdomain.com/api/gumroad-webhook
   ```

### 5. Run the Application

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Database Schema

### Tables
- `users`: User profiles and payment status
- `ideas`: Video ideas with metadata
- `likes`: Idea likes
- `comments`: Idea comments
- `messages`: Direct messages between users

### Key Features
- Row Level Security (RLS) enabled
- Automatic user profile creation on signup
- Payment status tracking with expiry dates
- Video storage in Supabase Storage

## API Endpoints

### `/api/gumroad-webhook`
Handles Gumroad payment webhooks to update user payment status.

## User Flow

### Idea Giver Flow
1. Sign up as Idea Giver
2. Purchase plan (single or unlimited)
3. Submit ideas with video
4. Receive messages from interested investors
5. Reply to investor messages

### Investor Flow
1. Sign up as Investor
2. Purchase investor access
3. Browse ideas on homepage
4. Like and comment on ideas
5. Start conversations with idea givers
6. Exchange messages

## Security Features

- Row Level Security on all database tables
- Authentication required for sensitive operations
- Payment verification before idea submission
- Messaging restrictions (only investors can initiate)
- File upload restrictions and validation

## Deployment

The application can be deployed on Vercel, Netlify, or any platform supporting Next.js.

Make sure to:
1. Set all environment variables
2. Configure Gumroad webhooks to point to your production domain
3. Update CORS settings in Supabase if needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.