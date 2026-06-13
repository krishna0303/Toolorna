# ToolMatch AI — Complete Product Context

## Product Overview
ToolMatch is an AI-powered software tool recommendation engine built specifically for Indian users.
Users answer 4 simple questions, the AI recommends the single best software tool for their exact
situation, finds the best working coupon code live from the internet, and presents an affiliate
buy link — all in under 60 seconds.

**Tagline:** "Find Your Perfect Tool in 60 Seconds"

---

## Core Problem Being Solved
Indian professionals, students and freelancers are overwhelmed by thousands of software tools.
They waste hours researching, reading reviews, and still end up buying the wrong tool.
ToolMatch solves this by giving ONE perfect recommendation with a discount — instantly.

---

## Target Audience
- Indian professionals aged 18-35
- Students, freelancers, developers, content creators, small business owners
- People who want the right tool without research
- Budget-conscious Indian users who want maximum discount

---

## Core User Flow (Exact Step by Step)

```
Step 1: Landing Page
  → Headline: "Find Your Perfect Tool in 60 Seconds"
  → Subheadline: "Answer 4 questions. Get 1 perfect tool. Save money with exclusive coupons."
  → Single CTA button: "Find My Perfect Tool →"
  → Trust indicators: "10,000+ Indians matched" / "Average saving ₹2,400"

Step 2: 4 Question Form (one question per screen, progress bar at top)
  Q1: What best describes you?
      Options: Student / Freelancer / Developer / Content Creator / Small Business / Working Professional
  
  Q2: What is your biggest challenge right now?
      Options: Save Time / Save Money / Grow Online Presence / Manage Work Better /
               Create Content Faster / Learn New Skills / Build a Website
  
  Q3: What is your monthly budget for tools?
      Options: Free Only / Under ₹500 / ₹500–₹2000 / ₹2000+
  
  Q4: Which tools have you already tried? (not happy with them)
      Free text input — optional, can skip

Step 3: Email Capture Screen
  → "Your perfect tool match is ready!"
  → "Enter your email to see your result + exclusive coupon code"
  → Email input + "Show My Match →" button
  → Small text: "No spam. Just your result and occasional tool deals."

Step 4: Loading Screen
  → Animated spinner with rotating text:
    "Analyzing your profile..."
    "Searching best tools for you..."
    "Finding exclusive coupon codes..."
    "Almost ready..."

Step 5: Results Page
  → Tool name + logo (fetched or placeholder)
  → "Why this is perfect for you" — 2-3 lines personalized
  → Key feature highlight
  → Indian pricing (monthly and annual)
  → Coupon code box (highlighted, one-click copy)
  → Discount badge "Save X%"
  → "Get This Tool Now →" button (affiliate link)
  → "Not what you expected? Try Again" link
  → Share result button (WhatsApp, Twitter, LinkedIn)
```

---

## Tech Stack (Strict — Do Not Deviate)

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS only (no other CSS frameworks)
- **Animations:** Framer Motion (minimal, purposeful only)
- **Icons:** Lucide React
- **Font:** Inter (Google Fonts)

### Backend
- **API Routes:** Next.js API routes (serverless functions)
- **AI Model:** Google Gemini 1.5 Flash API
- **Web Search for Coupons:** Gemini with grounding/search tool enabled

### Database
- **Primary DB:** Supabase (PostgreSQL)
- **Tables:**
  - `leads` — email, profession, problem, budget, tools_tried, created_at
  - `recommendations` — lead_id, tool_name, coupon_code, discount, affiliate_link, created_at
  - `clicks` — recommendation_id, clicked_at, ip_hash

### Email
- **Provider:** Mailchimp API
- **Lists:** One master list "ToolMatch Users"
- **Trigger:** On email capture (Step 3)

### Hosting & Deployment
- **Platform:** Vercel
- **Environment:** Production branch = main
- **SSL:** Automatic via Vercel

### Payments (Future — Do Not Build Yet)
- Razorpay (for premium features later)

---

## Environment Variables (All Required)

```env
# Gemini AI
GEMINI_API_KEY=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Mailchimp
MAILCHIMP_API_KEY=
MAILCHIMP_SERVER_PREFIX=
MAILCHIMP_LIST_ID=

# App
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_GA_ID= (Google Analytics — optional later)
```

---

## Supabase Database Schema

```sql
-- Leads table
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  profession TEXT NOT NULL,
  problem TEXT NOT NULL,
  budget TEXT NOT NULL,
  tools_tried TEXT,
  ip_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recommendations table
CREATE TABLE recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id),
  tool_name TEXT NOT NULL,
  tool_description TEXT,
  why_perfect TEXT,
  key_feature TEXT,
  indian_price TEXT,
  coupon_code TEXT,
  discount_percent TEXT,
  affiliate_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Click tracking table
CREATE TABLE clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recommendation_id UUID REFERENCES recommendations(id),
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_hash TEXT
);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE clicks ENABLE ROW LEVEL SECURITY;
```

---

## Gemini API Integration

### Recommendation Prompt Template
```
You are an expert software tool advisor for Indian users.
You have deep knowledge of all software tools, their Indian pricing, and current discount offers.

User Profile:
- Profession: {profession}
- Biggest Challenge: {problem}
- Monthly Budget: {budget}
- Tools Already Tried: {tools_tried}

Your task:
1. Recommend EXACTLY ONE software tool that perfectly fits this user.
2. Search the internet RIGHT NOW and find the best working coupon code for that tool.
   - Find the highest discount percentage available today
   - Verify it is likely still active (check recent sources)
   - If no coupon exists, say "No coupon available right now"

Respond ONLY in this exact JSON format, nothing else:
{
  "tool_name": "exact tool name",
  "tagline": "one line what it does",
  "why_perfect": "2-3 lines explaining exactly why this fits THIS user's profile",
  "key_feature": "the single most useful feature for this user",
  "indian_price_monthly": "₹XXX/month",
  "indian_price_annual": "₹XXXX/year",
  "free_tier": true/false,
  "coupon_code": "CODEXXX or null",
  "discount_percent": "XX% or null",
  "coupon_source": "where you found this coupon",
  "coupon_expiry": "date or unknown",
  "affiliate_category": "hosting/vpn/design/productivity/marketing/other"
}
```

### Gemini API Call Config
```javascript
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  tools: [{ googleSearch: {} }], // enables web search for coupon finding
});
```

---

## Affiliate Links Map
Update this as you join affiliate programs.

```javascript
export const AFFILIATE_LINKS = {
  "Hostinger": "https://www.hostinger.in/",         // replace with affiliate URL
  "NordVPN": "https://nordvpn.com/",                // replace with affiliate URL
  "Canva": "https://www.canva.com/",                // replace with affiliate URL
  "SEMrush": "https://www.semrush.com/",            // replace with affiliate URL
  "Notion": "https://www.notion.so/",               // replace with affiliate URL
  "Grammarly": "https://www.grammarly.com/",        // replace with affiliate URL
  "Mailchimp": "https://mailchimp.com/",            // replace with affiliate URL
  "Envato": "https://elements.envato.com/",         // replace with affiliate URL
  "Shopify": "https://www.shopify.com/",            // replace with affiliate URL
  "Figma": "https://www.figma.com/",               // replace with affiliate URL
};
```

---

## UI Design System

### Colors
```
Primary:     #6366F1  (Indigo — main CTA buttons)
Secondary:   #8B5CF6  (Purple — accents)
Background:  #0F0F0F  (Near black — main bg)
Surface:     #1A1A2E  (Dark navy — cards)
Border:      #2D2D44  (Subtle borders)
Text:        #F8F8F8  (Near white — primary text)
Muted:       #9CA3AF  (Gray — secondary text)
Success:     #10B981  (Green — coupon badge)
Warning:     #F59E0B  (Amber — discount badge)
```

### Typography
```
Font Family: Inter
Heading XL:  text-4xl font-bold (landing page hero)
Heading L:   text-2xl font-semibold (section titles)
Body:        text-base font-normal
Small:       text-sm text-muted
```

### Component Standards
```
Buttons:     rounded-xl, px-6 py-3, font-semibold
Cards:       rounded-2xl, border border-[#2D2D44], bg-[#1A1A2E]
Input:       rounded-xl, border, bg-[#1A1A2E], px-4 py-3
Progress:    thin bar at top, indigo color
Spacing:     consistent 4/8/16/24/32px scale
```

---

## API Routes Structure

```
/api/recommend     POST — takes user profile, returns AI recommendation
/api/save-lead     POST — saves email + answers to Supabase
/api/track-click   POST — tracks affiliate link clicks
/api/subscribe     POST — adds email to Mailchimp
```

---

## Security Requirements (Non-Negotiable)

```
1. API keys NEVER in frontend code — always server-side only
2. Rate limiting on /api/recommend — max 5 requests per IP per hour
3. Input validation on all form fields — sanitize before DB insert
4. Email validation — proper regex before saving
5. CORS — only allow requests from your own domain
6. Environment variables — never commit .env to git
7. Supabase RLS — Row Level Security enabled on all tables
8. IP hashing — never store raw IPs, always hash for privacy
```

---

## Folder Structure

```
toolmatch/
├── app/
│   ├── page.tsx                    (Landing page)
│   ├── quiz/
│   │   └── page.tsx               (4 question form)
│   ├── email/
│   │   └── page.tsx               (Email capture)
│   ├── loading-result/
│   │   └── page.tsx               (Loading animation)
│   ├── result/
│   │   └── page.tsx               (Results display)
│   └── layout.tsx                 (Root layout)
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── ProgressBar.tsx
│   ├── quiz/
│   │   ├── QuestionCard.tsx
│   │   └── OptionButton.tsx
│   └── result/
│       ├── ToolCard.tsx
│       ├── CouponBox.tsx
│       └── ShareButtons.tsx
├── lib/
│   ├── gemini.ts                  (Gemini API client)
│   ├── supabase.ts               (Supabase client)
│   ├── mailchimp.ts              (Mailchimp client)
│   ├── affiliates.ts             (Affiliate links map)
│   ├── rateLimit.ts              (Rate limiting logic)
│   └── validation.ts             (Input validation)
├── app/api/
│   ├── recommend/route.ts
│   ├── save-lead/route.ts
│   ├── track-click/route.ts
│   └── subscribe/route.ts
├── types/
│   └── index.ts                  (All TypeScript types)
├── .env.local                    (Never commit this)
├── .env.example                  (Commit this — no values)
├── .gitignore
├── CONTEXT.md
├── PROGRESS.md
└── RULES.md
```

---

## State Management
Use React Context for quiz state across pages.
Store: profession, problem, budget, tools_tried, email, recommendation.
No external state library needed — keep it simple.

---

## Performance Requirements
- Page load under 2 seconds
- Mobile first — test on 375px width
- No unnecessary dependencies
- Images optimized via Next.js Image component
- API response under 10 seconds (Gemini + web search)

---

## Analytics (Simple — No Paid Tools)
Track these events in Supabase clicks table:
- quiz_started
- quiz_completed
- email_submitted
- result_viewed
- affiliate_clicked
- coupon_copied
- result_shared
