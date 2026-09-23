# Lost & Found Caller

> AI-powered lost item recovery through intelligent phone calls using CALL-E.

Lost & Found Caller helps users search for lost belongings by turning a lost-item description into a focused Lost & Found inquiry.

The application supports both a **demo mode** for testing the complete workflow and a **live CALL-E mode** for real phone-call interactions.

The project also uses **PostgreSQL through Supabase** to persist lost-item reports, call attempts, conversation turns, locations, and search history.

---

## 🚀 Live Demo

https://lost-and-found-caller-1.vercel.app/

---

## 📌 Problem

When people lose an item in a mall, airport, public place, or other location, they often have to manually search for contact information and repeatedly call different Lost & Found or customer-support teams.

This process can be slow and frustrating.

Lost & Found Caller aims to simplify this process by allowing the user to provide:

- What they lost
- A description of the item
- When they lost it
- Where they lost it

The system then uses the selected location and CALL-E workflow to help perform the Lost & Found inquiry.

---

## 💡 Solution

Lost & Found Caller combines:

- **Next.js** for the web application
- **CALL-E** for AI-powered phone calls
- **PostgreSQL** for persistent data storage
- **Supabase** for hosted PostgreSQL and database management
- **Vercel** for deployment

The application stores the user's lost-item report and the resulting call information so that the search history can persist across sessions.

---

## ✨ Features

### Lost Item Search

Users can provide:

- Item name
- Item description
- When the item was lost
- Location where it was lost

### AI Phone Call

In live mode, CALL-E can be used to contact the selected location and perform the Lost & Found inquiry.

### Demo Mode

The application includes a demo mode that simulates the complete workflow without requiring a real phone call.

The demo shows:

1. Search started
2. Call initiated
3. AI conversation
4. Item comparison
5. Match result
6. Recovery guidance

### Match Analysis

The demo workflow analyzes item characteristics such as:

- Item type
- Color
- Distinctive features
- Contents
- Description details
- Time information

It then produces a match result and confidence score.

### Persistent Search History

Searches are stored in PostgreSQL so that previous searches can remain available after refreshing the application.

### Conversation Storage

Demo conversation turns can also be stored in PostgreSQL and associated with their corresponding call attempt.

---

## 🏗️ Architecture

```text
                         ┌──────────────────────┐
                         │        USER          │
                         │ Lost Item Details    │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │    Next.js App       │
                         │   Web Interface      │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
          ┌──────────────────┐            ┌──────────────────┐
          │     CALL-E       │            │    API Routes    │
          │  AI Phone Calls  │            │  Next.js Server  │
          └────────┬─────────┘            └────────┬─────────┘
                   │                               │
                   │                               ▼
                   │                    ┌────────────────────┐
                   │                    │     PostgreSQL     │
                   │                    │   through Supabase │
                   │                    └─────────┬──────────┘
                   │                              │
                   │              ┌───────────────┼───────────────┐
                   │              │               │               │
                   │              ▼               ▼               ▼
                   │        lost_items      call_attempts    call_turns
                   │
                   ▼
          Lost & Found Result

                   ▼
          Lost & Found Result
```

## 🗄️ PostgreSQL Database

PostgreSQL is used as the persistent relational database for the application.

Supabase provides the hosted PostgreSQL database and dashboard used by the project.

### Database Tables

#### 1. `locations`

Stores the Lost & Found locations that the application can contact.

Important fields include:

- `id`
- `name`
- `city`
- `phone`
- `contact_type`
- `description`
- `live_calling_enabled`

#### 2. `lost_items`

Stores the user's lost-item reports.

Important fields include:

- `id`
- `item_name`
- `description`
- `lost_date`
- `lost_when`
- `lost_location`
- `status`
- `created_at`

#### 3. `call_attempts`

Stores the call/search attempt associated with a lost item.

Important fields include:

- `id`
- `lost_item_id`
- `location_id`
- `scenario_id`
- `status`
- `match_score`
- `result`
- `created_at`

#### 4. `call_turns`

Stores individual conversation turns associated with a call attempt.

Important fields include:

- `id`
- `call_attempt_id`
- `speaker`
- `message`
- `turn_order`
- `created_at`

### Database Relationship

```text
locations
    │
    ▼
call_attempts
    │
    ├──────────────► lost_items
    │
    ▼
call_turns
```

A lost-item report can have call attempts, and a call attempt can have multiple conversation turns.

---

## 🔄 How the PostgreSQL Workflow Works

When a user starts a search:

```text
1. User enters lost item details
                ↓
2. Next.js sends the data to the server
                ↓
3. Lost item is inserted into PostgreSQL
                ↓
4. CALL-E / demo workflow runs
                ↓
5. Call attempt is recorded
                ↓
6. Conversation turns can be recorded
                ↓
7. Search history remains available
```

This allows the application to maintain persistent records instead of keeping the information only in browser state.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js | Frontend and server-side application |
| React | User interface |
| TypeScript | Application development |
| Tailwind CSS | Styling |
| CALL-E | AI-powered phone calling |
| PostgreSQL | Persistent relational database |
| Supabase | Hosted PostgreSQL database |
| Vercel | Deployment |
| GitHub | Source code and version control |

---

## 📂 Project Structure

```text
lost-and-found-caller/
│
├── app/
│   ├── api/
│   │   ├── call/
│   │   ├── call-attempts/
│   │   ├── call-turns/
│   │   ├── calle-test/
│   │   ├── db-test/
│   │   ├── history/
│   │   └── lost-items/
│   │
│   ├── page.tsx
│   └── ...
│
├── public/
│
├── lib/
│   └── supabase.ts
│
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

---

## 🔌 API Routes

The application uses Next.js API routes to communicate with the database and calling workflow.

### `/api/lost-items`

Stores lost-item reports in PostgreSQL.

### `/api/call-attempts`

Stores call/search attempt information.

### `/api/call-turns`

Stores conversation turns associated with a call attempt.

### `/api/history`

Retrieves persistent search history.

### `/api/db-test`

Used to verify the database connection.

### `/api/call`

Handles the application call workflow.

### `/api/calle-test`

Used for CALL-E testing.

---

## 💻 Getting Started

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- Git

### Clone the Repository

```bash
git clone https://github.com/MadhuriBaja/lost-and-found-caller.git
```

Move into the project directory:

```bash
cd lost-and-found-caller
```

Install dependencies:

```bash
npm install
```

### Environment Variables

Create a `.env.local` file.

Add:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SECRET_KEY=your_supabase_secret_key
```

Add any other environment variables required for the CALL-E integration.

> Never commit secret keys or API keys to GitHub.

### Run Locally

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 🚀 Deployment

The application is deployed using Vercel.

### Production Application

https://lost-and-found-caller-1.vercel.app/

The production deployment uses environment variables for the Supabase configuration.

---

## 🎥 Demo Videos

### CALL-E Application Demo

This video demonstrates the complete Lost & Found Caller application, including the CALL-E phone-calling workflow and the overall user experience.

**Watch the CALL-E Demo:**  
https://youtu.be/VkZ7RFSmc_c

### PostgreSQL Database Demo

This video demonstrates the PostgreSQL database used by the application through Supabase, including the stored application records and database tables.

**Watch the PostgreSQL Demo:**  
https://youtu.be/AkPZ8N-0p98


## 🐘 PostgreSQL Database Demo

The PostgreSQL database can be viewed through the Supabase dashboard.

The demonstration will show the application creating records and those records being stored in PostgreSQL.

The demo will cover:

```text
User Search
     ↓
lost_items
     ↓
call_attempts
     ↓
call_turns
```

Screenshots or a video of the PostgreSQL tables will be included as part of the project demonstration.

---

## 🔐 Security

The Supabase secret key is kept on the server and is not exposed to the browser.

Environment variables are used for sensitive configuration.

Secret keys should never be committed to the repository.

---

## 📚 What I Learned

Building this project helped me understand:

- PostgreSQL database design
- Relational database relationships
- Connecting a Next.js application to PostgreSQL
- Using Supabase as a hosted PostgreSQL platform
- Creating server-side API routes
- Persisting application data
- Storing call attempts and conversation data
- Deploying a database-backed application on Vercel
- Integrating AI phone-call workflows into a web application

---

## 🔮 Future Improvements

Possible future improvements include:

- Automatic discovery of Lost & Found contact information
- Support for multiple locations during a single search
- More advanced item matching
- Better call-result analysis
- Additional recovery workflows
- Authentication and user-specific search history
- More detailed call analytics

---

## 🔗 Links

### Live Demo

https://lost-and-found-caller-1.vercel.app/

### GitHub Repository

https://github.com/MadhuriBaja/lost-and-found-caller


### Medium Article

https://medium.com/@madhurib4555/building-a-lost-found-caller-with-postgresql-and-call-e-7a938885abcf

---

## 👩‍💻 Author

**Madhuri Baja**

B.Tech CSE Student

GitHub:  
https://github.com/MadhuriBaja

---

## ⭐ Project

If you find this project interesting, feel free to explore the repository and try the live demo.
