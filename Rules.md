# ToolMatch AI — Coding Rules
# READ THIS BEFORE EVERY SINGLE CHANGE. NO EXCEPTIONS.

---

## 🔴 CRITICAL RULES — NEVER BREAK THESE

```
1. NEVER put API keys in frontend code. Ever.
   All API calls must go through /app/api/ routes only.

2. NEVER commit .env.local to git.
   Always check .gitignore before any commit.

3. NEVER break existing working features.
   Before any change, understand what is already working.

4. NEVER add unnecessary dependencies.
   If Tailwind can do it, do not add a new CSS library.
   If native JS can do it, do not add a new package.

5. NEVER skip error handling.
   Every API call must have try/catch with user-friendly error message.

6. NEVER store raw IP addresses.
   Always hash IPs before storing: crypto.createHash('sha256').update(ip).digest('hex')
```

---

## 📋 BEFORE EVERY SESSION

```
Step 1: Read CONTEXT.md completely
Step 2: Read PROGRESS.md — know exact current state
Step 3: Confirm which phase and task we are on
Step 4: Tell me what you understand before writing any code
Step 5: Wait for my confirmation then proceed
```

---

## 📋 AFTER EVERY SESSION

```
Step 1: Update PROGRESS.md — check off completed items
Step 2: Add session entry to Session Log in PROGRESS.md
Step 3: Note exactly where we stopped
Step 4: Note the next task clearly
```

---

## 🏗️ CODE ARCHITECTURE RULES

### File Organization
```
- One component per file
- File name matches component name exactly
- All reusable UI in /components/ui/
- All page-specific components in /components/[pagename]/
- All API clients in /lib/
- All TypeScript types in /types/index.ts
- No random files in root directory
```

### TypeScript
```
- TypeScript strict mode always on
- No use of 'any' type — ever
- Define all types in /types/index.ts
- All function parameters must be typed
- All API responses must have typed interfaces
```

### Naming Conventions
```
Components:     PascalCase    → QuestionCard.tsx
Functions:      camelCase     → getRecommendation()
Constants:      UPPER_SNAKE   → AFFILIATE_LINKS
CSS classes:    Tailwind only → no custom class names
API routes:     kebab-case    → /api/save-lead
Variables:      camelCase     → userProfile
```

---

## 🎨 UI/DESIGN RULES

### Color Usage
```
Primary buttons:    bg-indigo-500 hover:bg-indigo-600
Secondary buttons:  border border-indigo-500 text-indigo-500
Background:         bg-[#0F0F0F]
Cards/Surfaces:     bg-[#1A1A2E]
Borders:            border-[#2D2D44]
Primary text:       text-[#F8F8F8]
Secondary text:     text-gray-400
Success/Coupon:     text-emerald-400 bg-emerald-400/10
Discount badge:     text-amber-400 bg-amber-400/10
```

### Spacing Rules
```
- Use Tailwind spacing scale only: p-4, p-6, p-8, gap-4, gap-6
- No arbitrary pixel values like p-[13px]
- Consistent padding on cards: p-6
- Section spacing: py-16 or py-24
```

### Mobile First
```
- Design for 375px width first
- Use responsive prefixes: md: lg: for larger screens
- Test every component at 375px before moving on
- Touch targets minimum 44px height (py-3 minimum on buttons)
```

### Animation Rules
```
- Framer Motion for page transitions only
- CSS transitions for hover states (transition-all duration-200)
- Loading spinner: simple CSS animation, no library
- No flashy or distracting animations
- Animations must feel fast and purposeful
```

### Simplicity Rules
```
- If it doesn't serve the user flow — remove it
- Maximum 2 font sizes per page
- Maximum 3 colors used prominently per page
- No decoration for decoration's sake
- Every element must have a purpose
```

---

## 🔒 SECURITY RULES

### API Security
```typescript
// Every API route must have this structure:
export async function POST(request: Request) {
  try {
    // 1. Rate limit check first
    const rateLimitResult = await checkRateLimit(request);
    if (!rateLimitResult.allowed) {
      return Response.json({ error: 'Too many requests' }, { status: 429 });
    }

    // 2. Parse and validate input
    const body = await request.json();
    const validation = validateInput(body);
    if (!validation.valid) {
      return Response.json({ error: validation.message }, { status: 400 });
    }

    // 3. Business logic here
    // ...

    // 4. Return success
    return Response.json({ success: true, data: result });

  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
```

### Environment Variables
```
- Server only vars: no NEXT_PUBLIC_ prefix
- Client safe vars: NEXT_PUBLIC_ prefix only for truly public values
- Never log environment variables
- Always check var exists before using:
  if (!process.env.GEMINI_API_KEY) throw new Error('Missing GEMINI_API_KEY');
```

### Input Validation Rules
```
Email:        Must match /^[^\s@]+@[^\s@]+\.[^\s@]+$/
Profession:   Must be one of the 6 allowed values only
Problem:      Must be one of the 7 allowed values only
Budget:       Must be one of the 4 allowed values only
Tools tried:  Max 500 characters, strip HTML tags
All strings:  Trim whitespace, strip script tags
```

### Rate Limiting Implementation
```typescript
// In lib/rateLimit.ts
// Store: in-memory Map (sufficient for V1)
// Limit: 5 requests per IP per hour
// Key: hashed IP address
// Reset: sliding window — 1 hour from first request
```

---

## 🔌 API INTEGRATION RULES

### Gemini API
```typescript
// Always use gemini-1.5-flash (cheapest, fast enough)
// Always enable googleSearch tool for coupon finding
// Always parse response as JSON — wrap in try/catch
// If JSON parse fails — retry once, then return error
// Timeout: 15 seconds maximum wait
// Never expose Gemini API key — server side only
```

### Supabase
```typescript
// Use server-side client (service role) for writes
// Use anon client for reads only
// Always check for error in response:
  const { data, error } = await supabase.from('leads').insert(...)
  if (error) throw new Error(error.message);
// Never use .single() without handling null case
```

### Mailchimp
```typescript
// Add to list on email capture — non-blocking
// If Mailchimp fails — log error but DO NOT block user
// User should still see their result even if Mailchimp fails
// Tags to add: 'toolmatch-user', profession value
```

---

## ⚡ PERFORMANCE RULES

```
- No images without Next.js <Image> component
- No blocking API calls on initial page load
- Quiz state in React Context — no API calls during quiz
- API call happens only on loading page (/loading-result)
- All API routes must respond within 15 seconds
- Bundle size: no large unnecessary packages
```

---

## 🐛 ERROR HANDLING RULES

### User-Facing Errors
```
API timeout:     "Taking longer than usual. Please try again."
Network error:   "Connection issue. Please check your internet."
Invalid input:   "Please fill in all required fields."
Rate limit:      "You've made too many requests. Please wait 1 hour."
General error:   "Something went wrong. Please try again."
```

### Error Display Rules
```
- Show error inline (not alert boxes)
- Red text below the relevant field for form errors
- Full page error state for result page failures (with retry button)
- Never show raw error messages to users
- Always log actual errors to console for debugging
```

---

## 📦 ALLOWED DEPENDENCIES ONLY

```json
{
  "dependencies": {
    "next": "14.x",
    "react": "18.x",
    "react-dom": "18.x",
    "@google/generative-ai": "latest",
    "@supabase/supabase-js": "latest",
    "framer-motion": "latest",
    "lucide-react": "latest"
  },
  "devDependencies": {
    "typescript": "latest",
    "tailwindcss": "latest",
    "@types/node": "latest",
    "@types/react": "latest"
  }
}
```

**Do NOT add any other packages without asking first.**

---

## 🚀 DEPLOYMENT RULES

```
- Main branch = production (auto-deploys to Vercel)
- Never push broken code to main
- Test locally before pushing
- All env vars must be in Vercel dashboard before deploy
- Check Vercel build logs after every deploy
- If build fails — fix immediately before anything else
```

---

## 💬 COMMUNICATION RULES (FOR AI)

```
Before writing code:
  → Confirm understanding of what needs to be built
  → List files that will be created or modified
  → Flag any conflicts with existing code

While writing code:
  → Write complete files, never partial snippets
  → Add comments on complex logic
  → Follow all rules above without being told

After writing code:
  → Tell me exactly what was created/modified
  → Tell me what to test
  → Tell me next step
  → Remind me to update PROGRESS.md
```

---

## 🎯 V1 SCOPE — STICK TO THIS

Build ONLY these things for V1:
```
✅ Landing page
✅ 4 question quiz
✅ Email capture
✅ Loading screen
✅ Results page
✅ Gemini recommendation
✅ Coupon finding
✅ Supabase data storage
✅ Mailchimp email capture
✅ Affiliate links
✅ Share buttons
✅ Basic click tracking
```

DO NOT build in V1:
```
❌ User accounts / login
❌ Dashboard
❌ Payments / subscriptions
❌ Blog
❌ Comparison feature (multiple tools)
❌ Admin panel
❌ Push notifications
❌ Any social features
```

If I ask for something outside V1 scope — remind me of this list and confirm before building.
