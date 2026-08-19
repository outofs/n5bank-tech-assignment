# N5Deal Marketplace Prototype

## Overview

N5Deal Marketplace Prototype is a role-based marketplace for financial and M&A-style deal discovery.

Implemented roles:

- Buyer: manages an investment profile, discovers assets, reviews deterministic Smart Match results, and contacts Sellers.
- Seller: manages asset listings, browses qualified Buyers, and handles lightweight inquiries.
- Platform Manager: moderates users and assets through status-based controls and a dashboard view.

## Core User Flows

Buyer:

- edit investment profile/preferences
- browse/search/filter assets
- view deterministic Smart Match
- inspect asset details
- contact Seller
- view inquiries/messages

Seller:

- create assets
- save Draft / Publish
- edit / unpublish assets
- browse/search/filter Buyers
- contact Buyers
- view inquiries/messages

Platform Manager:

- dashboard
- search/filter users
- suspend/reactivate Buyers and Sellers
- search/filter assets
- suspend/restore assets

## Tech Stack

Actual installed stack in this repository:

- Next.js 16 App Router
- React 19
- TypeScript 5
- Tailwind CSS 4
- PostgreSQL
- Prisma 7 with `@prisma/client` and `@prisma/adapter-pg`
- `pg`
- Zod 4
- `react-select`
- Vitest 4
- ESLint 9

## Architecture

- Next.js App Router provides route structure and server-first rendering.
- Server Components are the default; client components are used only for interactive form and selector UI.
- Server Actions handle mutations such as profile updates, asset changes, moderation actions, and contact requests.
- PostgreSQL + Prisma provide persistent storage and typed query access.
- Demo access is implemented through a cookie-backed session in `lib/demo-session.ts`.
- Authorization is centralized server-side in `lib/authz.ts`.
- Zod validates domain inputs and action payloads.
- Structured selectors use `react-select`.
- Filters are URL search-param driven and applied server-side in route handlers/pages.
- Query result types are derived from Prisma `select` definitions and `Prisma.*GetPayload` types instead of duplicated models.
- Vitest covers unit and business-rule tests.
- Forms use React 19 form actions (`useActionState`, `useFormStatus`) and controlled components. `react-hook-form` is not installed or used in this repository.

## Data Model

- `User`: base identity for Buyer, Seller, or Manager, including status, company, and country.
- `BuyerProfile`: one-to-one buyer-specific investment data, thesis, ranges, and preferred countries/categories.
- `SellerProfile`: one-to-one seller-specific company and operating context.
- `Asset`: seller-owned listing with marketplace metadata, pricing, lifecycle status, and optional structured fields such as employees, founded year, and license type.
- `ContactRequest`: lightweight inquiry between users, optionally linked to an asset, with `PENDING`, `ACCEPTED`, or `DECLINED` status.

## Key Technical Decisions

- Demo authentication was used instead of production auth to keep the assignment focused on product flows, authorization boundaries, and persistence rather than identity-provider integration.
- PostgreSQL persistence was chosen so filters, moderation state, profile edits, and contact requests are backed by a real relational store rather than in-memory mocks.
- Moderation uses status changes instead of deletion so records remain recoverable and visibility rules stay explicit.
- `ContactRequest` was used instead of real-time chat to support the required inquiry flow with much lower implementation complexity.
- Filters are URL-driven and server-side so views are shareable, bookmarkable, and consistent with database-backed results.
- Structured country/category inputs are normalized to reduce duplicate labels and inconsistent filter behavior.
- Prisma and Zod inference are preferred over duplicated TypeScript models to keep validation, queries, and UI types aligned.
- Smart Match is deterministic and explainable so reviewers can inspect and verify the output directly from the scoring rules.

## Smart Match

Smart Match is deterministic matching, not AI.

Scoring weights:

- price fit: 50%
- category match: 30%
- country match: 20%

Implementation notes:

- The score is calculated from explicit buyer preferences and asset fields.
- The result includes human-readable reasons for matched criteria.
- If some criteria are not configured by the buyer, scoring is normalized over the applicable weights only.

## Product Assumptions

- Sellers browse Buyers rather than using the Buyer-side asset marketplace.
- Restored suspended assets return to `DRAFT`, not directly back to `PUBLISHED`.
- Contact requests are lightweight inquiries rather than chat threads.
- Production authentication was intentionally outside prototype scope.

## AI Tools Used

AI used during development:

- OpenAI Codex was used for implementation assistance, refactoring, UI iteration, code review support, and README drafting.

Product functionality:

- The shipped product does not call AI services.
- Smart Match is deterministic scoring logic implemented in application code, not AI inference.

## Running Locally

Install dependencies:

```bash
npm install
```

Environment configuration:

1. Create `.env`
2. Set `DATABASE_URL` to a PostgreSQL connection string

Generate Prisma client:

```bash
npx prisma generate
```

Apply migrations:

```bash
npx prisma migrate dev --name init
```

Seed the database:

```bash
npx prisma db seed
```

Start the development server:

```bash
npm run dev
```

Run tests:

```bash
npm test
```

Run typecheck:

```bash
npm run typecheck
```

Run lint:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

Optionally start the production server after building:

```bash
npm run start
```

## Environment Variables

Use placeholders only:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
```

## Testing

- Vitest covers unit and business-rule tests for validation, filter normalization, and deterministic Smart Match logic.
- Current passing test count: 23 tests across 3 test files.
- Role-gated pages, moderation transitions, and seeded flows currently rely on manual/database-backed verification rather than browser E2E automation.

## What I Would Improve With More Time

- production authentication and real user/session management
- richer messaging and notifications
- moderation audit history
- file and document uploads
- more advanced search, ranking, and personalized matching
- localization/internationalization
- admin-managed marketplace taxonomies for asset types, countries, categories, and license types
- broader automated test coverage, including database integration and end-to-end tests
- improved SEO, route metadata, sitemap, and structured data for public marketplace pages
- further accessibility, responsive UX, and visual refinement
