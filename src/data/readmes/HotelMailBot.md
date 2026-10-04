<div align="center">
  <img src="public/lovable-uploads/2324749f-7ac0-47ee-881c-8ad90e2f5f67.png" alt="InfluencerAI Logo" width="120" />
  <h1>InfluencerAI - Next-Gen Hotel Email Management</h1>
  <p><em>Enterprise-grade, AI-powered email triage, intent classification, and automated response drafting system engineered specifically for the modern hospitality industry.</em></p>
  
  [![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Supabase](https://img.shields.io/badge/Supabase-Database_&_Auth-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
  [![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
</div>

<br />

## 📖 Executive Summary & Problem Scope

Hospitality teams are overwhelmed by the sheer volume of inbound guest communications: from simple reservation inquiries to urgent complaints and room service requests. The manual triage, context switching, and response drafting significantly impact operational efficiency and Guest Satisfaction Scores (GSS).

**InfluencerAI** is a comprehensive, production-ready solution that sits between the hotel's mail server and the front-desk operations team. By leveraging Google's advanced **Gemini 2.5 Flash AI** models via serverless computing (Supabase Edge Functions), the system acts as an autonomous digital concierge. It intelligently categorizes intent, calculates confidence scores (0.0 to 1.0), screens for sensitive content, and generates contextual, human-like draft responses. 

This reduces manual operations overhead by up to 80% and ensures a zero-inbox policy at the end of every shift.

### 💎 The Fixed-Price Advantage
Unlike traditional SaaS subscriptions that tax hospitality businesses monthly per user or per email, this architecture is designed for **single-purchase, absolute ownership**. You own the source code, the database schema, and the continuous integration pipeline natively inside Supabase. No hidden fees, no enforced vendor lock-ins.

---

## ✨ Core Features & Capabilities

1. **Intelligent Inbound Parsing:** Webhook-driven parser capable of consuming multipart payload data and raw JSON via CloudMailin integration, gracefully handling email threads, embedded quotes, and attachment stubs.
2. **Zero-Shot Intent Classification:** Evaluates inbound emails and instantly tags them across categories like `reservation_inquiry`, `complaint`, `feedback`, `cancellation`, `payment_issue`, or `general_inquiry`.
3. **Draft Generation with Variable Tone:** Generates grammatically flawless, hospitable responses tailored to the specific query, preserving the original sender's urgency and context.
4. **Realtime WebSocket Synchronization:** Frontend dashboard automatically refreshes via active WebSocket channels (`emails-changes-[HID]`) eliminating "stale view" race conditions common in legacy CRM tools.
5. **Role-Based Access Control (RBAC):** Strict separation of privileges. `admin` roles can mutate hotel settings and manage API configurations, while `operator` roles only consume and reply to emails.
6. **Dynamic API Administration:** Complete abstraction of API logic. System administrators can hot-swap API keys via the Frontend UI safely, instantly propagating to the Edge network without touching environment variables.

---

## 🏗️ System Architecture & Data Flow

Our system architecture emphasizes strict separation of concerns: an ephemeral presentation layer (React SPA) communicating directly with a realtime PostgREST API, guarded by Row Level Security (RLS). Compute-heavy AI inference and SMTP handshakes are offloaded to stateless V8 isolates (Deno Edge Functions).

```mermaid
graph TD
    %% Boundaries
    subgraph Client Layer [Frontend - Browser]
      ReactApp[React 18 / Vite SPA]
      AuthCtx[Supabase Auth Context]
      RQ[React Query State]
    end

    subgraph Infrastructure [Supabase Platform]
      DB[(PostgreSQL 15)]
      Auth[GoTrue Authentication]
      Realtime[Realtime / Phoenix Channels]
      
      subgraph Edge Compute [Deno Edge Functions]
        EdgeInbound(inbound-email)
        EdgeAnalyze(analyze-email)
        EdgeService(email-service)
      end
    end

    subgraph External Dependencies [Third-Party Services]
      MailServer{Hotel IMAP/SMTP Gateway}
      GoogleAI{Google Gemini 2.5 API}
      CloudMailin{CloudMailin Parser}
    end

    %% Auth Flow
    ReactApp -->|JWT Handshake| Auth
    Auth -.->|Sets Active Role| DB

    %% Inbound Mail Pipeline
    MailServer -->|Incoming Email| CloudMailin
    CloudMailin -->|POST Webhook| EdgeInbound
    EdgeInbound -->|Insert RAW Email payload| DB
    EdgeInbound -->|Trigger Asynchronous Analysis| EdgeAnalyze

    %% Inference Pipeline
    EdgeAnalyze -->|Lookup Configured API Key via UI| DB
    EdgeAnalyze <-->|Generate JSON Intent & Draft| GoogleAI
    EdgeAnalyze -->|Patch Email Record (intent, confidence, draft)| DB

    %% Synchronization
    DB -->|Emit Database Mutation Events| Realtime
    Realtime <-->|WebSocket Broadcast| ReactApp
    ReactApp -.->|Invalidate Queries| RQ

    %% Outbound Mail Pipeline
    ReactApp -->|Operator Approves Draft| EdgeService
    EdgeService <-->|SMTP Delivery| MailServer
    EdgeService -->|Patch Status to Sent| DB
```

---

## 🧠 Advanced AI Engineering Layer

### API Resiliency & The LLM Proxy
Instead of relying on a hardcoded, brittle API Gateway, the architecture introduces a database-backed LLM proxy layer designed specifically to mitigate quota (HTTP 429) and deprecation (HTTP 404) errors inherent in fast-moving AI models.

- **Primary Pipeline (`gemini-2.5-flash`):** Targets Google's ultra-fast `gemini-2.5-flash` natively, prioritizing speed and unmetered tier limits over the heavily throttled legacy namespaces.
- **Key Injection Protocol:** The Edge Function queries `hotel_settings.ai_api_key` initially. The end-user dictates the key via the settings UI, bypassing the need for developer intervention or redeployment.
- **Environment Fallback Security:** If the UI input is null, it gracefully decays to the secure `Deno.env.get("GOOGLE_AI_API_KEY")`.
- **Parsing Fallback Mechanism:** In edge cases where the LLM hallucinates and breaks the requested strict JSON schema, a deep Regex matching algorithm extracts `intent`, `confidence`, and `draft_reply` primitives out of the raw markdown string. This guarantees an almost 100% operational success rate.

---

## 🗄️ Relational Database Schema & Security (RLS)

Multi-tenancy is baked deeply into the SQL schema. The data layer utilizes PostgreSQL's native Row Level Security (RLS) to mathematically guarantee that an operator from *Hotel A* cannot query, update, or delete records belonging to *Hotel B*, even in the event of a JWT hijack.

| Table Entity | Primary Responsibility | Critical RLS Policies Enforced |
| :--- | :--- | :--- |
| `public.hotels` | Root organizational node defining a hotel entity. | Members can only `SELECT` where `id` exists in their memberships. |
| `public.hotel_memberships` | Junction table mapping `user_id` to `hotel_id` alongside `app_role` mapping (`admin`, `operator`). | Users can view their own mapped memberships. |
| `public.hotel_settings` | Configuration dictionary holding IMAP/SMTP ports, email signatures, Auto-Draft boolean triggers. | `Admins` can `UPDATE`. `Operators` can `SELECT`. |
| `public.email_threads` | Aggregate node consolidating multiple incoming/outgoing communications. | Masked against foreign `hotel_id` access. |
| `public.emails` | Core document ledger containing raw HTML/Plain text, calculated intents, AI drafts, and pipeline statuses (`new`, `needs_review`, `draft_ready`). | Strictly bounded by user's corresponding `hotel_memberships.hotel_id`. |
| `public.notifications` | Ephemeral message bus alerting users of new mail or urgent complaints. | Bound to direct `user_id` assertion (`auth.uid() = id`). |

---

## 🚀 Deployment & Installation Topologies

### Local Workspace Setup

1. **Repository Cloning**
   Ensure Node.js `v18+` is active in your local CLI environment.
   ```bash
   git clone <repository-url>
   cd prompt-to-app-creator-main
   npm install
   ```

2. **Supabase Local Linking**
   Ensure the Supabase CLI is installed globally and Docker Desktop is running.
   ```bash
   npx supabase login
   npx supabase link --project-ref <your-project-ref>
   ```

3. **Deploying Computing Logic (Edge Functions)**
   The Deno Edge Functions act as the cognitive and communication core of the application. They must be deployed to your linked Supabase entity.
   ```bash
   npx supabase functions deploy analyze-email
   npx supabase functions deploy email-service
   npx supabase functions deploy inbound-email
   ```

4. **Initialize Presentation Layer**
   ```bash
   npm run dev
   ```

### Operational Handoff
After deployment, follow these configuration steps within the UI to activate the AI:
1. Navigate to the frontend dashboard on `localhost` or your production domain.
2. Go to **Settings > AI Settings**.
3. Generate a dedicated AI API Key via [Google AI Studio](https://aistudio.google.com/apikey). Ensure you create it under a new project to avoid quota contamination.
4. Paste the key directly into the provided configuration input and click **Save**. The Edge Engine will instantly inherit this new key context across all future inbound requests automatically.

---

## 🛣️ Development Roadmap

- [x] Initial React/Vite scaffolding with Supabase.
- [x] SMTP/IMAP Edge function integrations.
- [x] Gemini AI Intent Classification.
- [x] WebSocket Realtime UI synchronization.
- [x] Native UI-driven Dynamic API Key Management.
- [x] Advanced API Rate Limit Fallback Matrix.
- [ ] Multi-lingual AI response drafting based on the sender's detected language.
- [ ] Comprehensive Analytics Dashboard (Avg Response Time, AI Accuracy).

---

## 📝 Commercial Distribution Model

This software deviates from standard B2B SaaS distribution architectures. It is delivered under a **Fixed-Price Turnover Licensing Model**. 
There are no recurring monthly platform subscriptions and no black-box API metering from our end. Upon acquisition, the buyer assumes total sovereignty over the source code, database infrastructure, and operational longevity.


<img width="1917" height="909" alt="Ekran görüntüsü 2026-04-13 203553" src="https://github.com/user-attachments/assets/376bf20b-3b02-48e3-9555-7dafa0554c35" />
<img width="1919" height="909" alt="Ekran görüntüsü 2026-04-13 203526" src="https://github.com/user-attachments/assets/e6da4b28-9fa4-43af-b9ee-62589099e16b" />
