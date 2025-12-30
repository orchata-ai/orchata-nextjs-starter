<div align="center">
    <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://cdn.orchata.ai/img/orchata-logo-dark.svg">
    <img alt="Orchata Logo" src="https://cdn.orchata.ai/img/orchata-logo-light.svg">
    </picture>
</div>

<div align="center">

**Infrastructure for intelligent applications**

[![Website](https://img.shields.io/badge/Website-orchata.ai-blue?style=for-the-badge&logo=internet-explorer)](https://orchata.ai)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/orchata-ai)

</div>

<p align="center">
  A powerful, production-ready AI chatbot template built with Next.js, the Vercel AI SDK, and Orchata knowledge base integration. Deploy to Vercel in minutes and start building intelligent chatbots with built-in knowledge base capabilities.
</p>

<p align="center">
  <a href="https://orchata.ai"><strong>Orchata Website</strong></a> ·
  <a href="#quick-start"><strong>Quick Start</strong></a> ·
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#deploy-your-own"><strong>Deploy</strong></a> ·
  <a href="#running-locally"><strong>Local Setup</strong></a>
</p>
<br/>

## Quick Start

Get your Orchata-powered AI chatbot running in 3 steps:

1. **Deploy to Vercel** - Click the button below to deploy instantly
2. **Add your Orchata API key** - Get it from [app.orchata.ai](https://app.orchata.ai/api-keys)
3. **Configure your database** - Vercel will set up Neon Postgres automatically

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/orchata-ai/orchata-vercel-ai-starter)

That's it! Your chatbot is ready to use. See [Deploy Your Own](#deploy-your-own) for detailed instructions.

## Features

### What's Included

- **Orchata Knowledge Base Integration**
  - Search across knowledge spaces with `queryKnowledge`
  - Discover relevant spaces with `findRelevantSpaces`
  - List and manage knowledge spaces
  - Upload documents and create new spaces
  - Seamless AI-powered knowledge retrieval

- **[Next.js](https://nextjs.org) App Router**
  - Advanced routing for seamless navigation and performance
  - React Server Components (RSCs) and Server Actions for server-side rendering
  - Optimized for production performance

- **[Vercel AI SDK](https://ai-sdk.dev/docs/introduction)**
  - Unified API for generating text, structured objects, and tool calls with LLMs
  - Hooks for building dynamic chat and generative user interfaces
  - Supports multiple model providers through Vercel AI Gateway

- **Artifact Generation**
  - Create and edit documents, code, and spreadsheets
  - Real-time collaborative editing
  - Rich content creation tools

- **[shadcn/ui](https://ui.shadcn.com)**
  - Beautiful, accessible component library
  - Styling with [Tailwind CSS](https://tailwindcss.com)
  - Component primitives from [Radix UI](https://radix-ui.com)

- **Data Persistence**
  - [Neon Serverless Postgres](https://vercel.com/marketplace/neon) for chat history and user data
  - [Vercel Blob](https://vercel.com/storage/blob) for file storage

- **[Auth.js](https://authjs.dev)**
  - Simple and secure authentication
  - Multiple provider support

### Optional Features

These features enhance the template but aren't required:

- **[Upstash Redis](https://vercel.com/marketplace/upstash)** - Enables resumable streams for better UX with long-running AI responses
- **Custom Authentication Providers** - Extend Auth.js with OAuth providers, social logins, etc.
- **Advanced Model Configuration** - Customize AI model selection, temperature, and other parameters

## Orchata Integration

This template showcases the ease of use of the Orchata SDK for knowledge base integration. The AI assistant has access to powerful tools for interacting with your knowledge base:

### Available Orchata Tools

- **`queryKnowledge`**: Search across knowledge spaces for relevant information from documents
- **`findRelevantSpaces`**: Discover which knowledge spaces are most relevant for a query
- **`listSpaces`**: List all available knowledge spaces
- **`getSpace`**: Get details of a specific knowledge space by ID
- **`createSpace`**: Create a new knowledge space for organizing documents
- **`updateSpace`**: Update an existing knowledge space (name, description, icon, etc.)
- **`deleteSpace`**: Delete (archive) a knowledge space
- **`getDocumentContent`**: Get the full content of a specific document
- **`uploadDocument`**: Upload a new document to a knowledge space

### Getting Your Orchata API Key

1. [Sign up here](https://app.orchata.ai/signup) (it's free!)
2. Navigate to your API key settings in the sidebar
3. Generate an API key, make sure the permissions are set to Read, Write, and Delete All Spaces (you can change this later), and press Create API Key
4. Copy your API key (you only get to see it once)
5. Add it to your environment variables as `ORCHATA_API_KEY`

### Setting Up Your Knowledge Base

1. Create knowledge spaces in the Orchata dashboard (or ask the AI to do it)
2. Upload documents to your spaces (or ask the AI to do it!)
3. The AI will automatically search and use your knowledge base when answering questions

## Model Providers

This template uses the [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) to access multiple AI models through a unified interface. The default configuration includes:

- **Anthropic Claude Sonnet 4.5** (default) - Best balance of speed, intelligence, and cost
- **OpenAI GPT-5.2** - Most capable OpenAI model
- **Google Gemini 3 Pro** - Most capable Google model
- **Claude 3.7 Sonnet (Thinking)** - Extended thinking for complex problems

### AI Gateway Authentication

**For Vercel deployments**: Authentication is handled automatically via OIDC tokens.

**For non-Vercel deployments**: Provide an AI Gateway API key by setting the `AI_GATEWAY_API_KEY` environment variable.

## Deploy Your Own

### One-Click Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/orchata-ai/orchata-vercel-ai-starter)

1. Click the button above to deploy to Vercel
2. Vercel will automatically:
   - Clone this repository
   - Set up a Neon Postgres database
   - Configure Vercel Blob storage
   - Set up the project with optimal settings
3. Add your environment variables:
   - `ORCHATA_API_KEY` - Get it from [app.orchata.ai/api-keys](https://app.orchata.ai/api-keys)
   - (Optional) `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` for resumable streams
4. Your app will be live! Visit your deployment URL to start using it.

### Post-Deployment

After deploying:

1. **Run database migrations**: Vercel will run migrations automatically during build, but you can also run them manually:
   ```bash
   vercel env pull
   pnpm db:migrate
   ```

2. **Set up your knowledge base**: 
   - Go to [app.orchata.ai](https://app.orchata.ai) and create knowledge spaces
   - Upload documents or ask the AI assistant to help

3. **Customize your chatbot**: 
   - Edit prompts in `lib/ai/prompts.ts`
   - Configure models in `lib/ai/models.ts`
   - Customize the UI in the `components/` directory

## Running Locally

### Prerequisites

- **Node.js 22+** - [Download here](https://nodejs.org/)
- **pnpm** - This template uses pnpm. Install with `npm install -g pnpm` or enable with `corepack enable`
- **PostgreSQL database** - [Neon](https://neon.tech) recommended (free tier available)
- **Orchata API key** - [Get one here](https://app.orchata.ai/api-keys) (free!)

### Setup Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/orchata-ai/orchata-vercel-ai-starter.git
   cd orchata-vercel-ai-starter
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

   This template uses [pnpm](https://pnpm.io) as the package manager. If you don't have pnpm installed, you can install it with `npm install -g pnpm` or use `corepack enable` (comes with Node.js 16+).

3. **Set up environment variables**

   Copy `.env.example` to `.env.local` and fill in your values:

   ```bash
   cp .env.example .env.local
   ```

   Then edit `.env.local` with your actual values. See [Environment Variables](#environment-variables) for details.

4. **Run database migrations**

   ```bash
   pnpm db:migrate
   ```

5. **Start the development server**

   ```bash
   pnpm dev
   ```

Your app should now be running on [localhost:3000](http://localhost:3000).

### Using Vercel CLI (Recommended)

For the best local development experience that matches production:

1. Install Vercel CLI: `npm i -g vercel`
2. Link your local instance: `vercel link`
3. Download environment variables: `vercel env pull`
4. Run migrations and start dev server:
   ```bash
   pnpm db:migrate
   pnpm dev
   ```

## Environment Variables

### Required

- `ORCHATA_API_KEY` - Your Orchata API key for knowledge base access
  - Get it from [app.orchata.ai/api-keys](https://app.orchata.ai/api-keys)
- `POSTGRES_URL` - PostgreSQL connection string for data persistence
  - Create a free database at [Neon](https://neon.tech) or use your own PostgreSQL instance

### Optional

- `UPSTASH_REDIS_REST_URL` - Upstash Redis URL for resumable streams
- `UPSTASH_REDIS_REST_TOKEN` - Upstash Redis token
  - Get both from [Upstash](https://vercel.com/marketplace/upstash) (free tier available)
- `AI_GATEWAY_API_KEY` - Vercel AI Gateway API key (only for non-Vercel deployments)
  - Not needed if deploying to Vercel (automatic OIDC authentication)
- `AUTH_SECRET` - Secret for authentication (generated automatically on Vercel)
  - Generate one: `openssl rand -base64 32` or use [generate-secret.vercel.app/32](https://generate-secret.vercel.app/32)
- `AUTH_URL` - Base URL for authentication callbacks
  - Use `http://localhost:3000` for local development

## Troubleshooting

### Common Issues

**"POSTGRES_URL environment variable is not set"**
- Make sure you've created a `.env.local` file with your `POSTGRES_URL`
- Check that the connection string is correct and the database is accessible

**"ORCHATA_API_KEY is missing"**
- Get your API key from [app.orchata.ai/api-keys](https://app.orchata.ai/api-keys)
- Make sure it's added to your `.env.local` file (local) or Vercel environment variables (production)

**Database migration errors**
- Ensure your `POSTGRES_URL` is correct and the database is running
- Try running `npm run db:migrate` again
- Check that you have the latest migrations: `npm run db:check`

**Build fails on Vercel**
- Verify all required environment variables are set in Vercel
- Check the build logs for specific error messages
- Ensure Node.js version is 22+ (Vercel should detect this automatically)

**Port already in use**
- Change the port: `PORT=3001 npm run dev`
- Or kill the process using port 3000

## Next Steps

Now that your chatbot is running, here's what you can do:

1. **Customize the AI behavior**
   - Edit system prompts in `lib/ai/prompts.ts`
   - Adjust model settings in `lib/ai/models.ts`

2. **Add your knowledge base**
   - Create spaces and upload documents at [app.orchata.ai](https://app.orchata.ai)
   - The AI will automatically use your knowledge base when answering questions

3. **Customize the UI**
   - Modify components in the `components/` directory
   - Update styles in `app/globals.css`
   - Check out [shadcn/ui](https://ui.shadcn.com) for more components

4. **Add features**
   - Implement custom tools in `lib/ai/tools/`
   - Add new routes in `app/`
   - Extend the database schema in `lib/db/schema.ts`

5. **Deploy to production**
   - Your Vercel deployment is already production-ready!
   - Set up a custom domain in Vercel settings
   - Configure environment variables for production

## Architecture

This template demonstrates how to integrate Orchata knowledge base capabilities into an AI chatbot:

1. **Orchata SDK Integration**: The `@orchata-ai/sdk` package provides tools that are automatically available to the AI
2. **Tool Execution**: The AI can call Orchata tools to search, retrieve, and manage knowledge base content
3. **Seamless UX**: Knowledge base results are seamlessly integrated into the chat experience

## Learn More

- [Orchata Documentation](https://orchata.ai/docs)
- [Vercel AI SDK Documentation](https://ai-sdk.dev)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Deployment Guide](https://vercel.com/docs)

## License

Apache License 2.0

This project is based on the [Vercel AI Chatbot Template](https://github.com/vercel/ai-chatbot) and has been modified to include Orchata knowledge base integration. Both the original work and modifications are licensed under the Apache License, Version 2.0.
