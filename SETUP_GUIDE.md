# Shadow Raiders Alliance — Setup & Deployment Guide

Follow these steps in order. The whole process takes about 20–30 minutes.

---

## STEP 1 — Install Node.js (if you don't have it)

1. Go to https://nodejs.org
2. Download and install the **LTS** version
3. Restart your computer after installing

---

## STEP 2 — Set up your free Supabase database

1. Go to https://supabase.com and create a free account
2. Click **New Project**, give it a name like "shadowraiders", choose a region close to you
3. Set a strong database password and save it somewhere safe
4. Wait ~2 minutes for the project to finish setting up

**Create your database tables:**
5. In your Supabase project, click **SQL Editor** in the left sidebar
6. Click **New Query**
7. Open the file `supabase-schema.sql` from this project folder
8. Copy the entire contents and paste it into the SQL Editor
9. Click **Run** — you should see "Success" messages

**Get your API keys:**
10. Go to **Project Settings** → **API** in the left sidebar
11. Copy these three values — you'll need them in Step 3:
    - `Project URL` (looks like https://xxxx.supabase.co)
    - `anon / public` key (long string under "Project API keys")
    - `service_role` key (click "Reveal" to see it — keep this secret)

---

## STEP 3 — Configure environment variables

1. In this project folder, find the file `.env.local.example`
2. Make a copy of it and name the copy `.env.local`
3. Open `.env.local` in any text editor (Notepad is fine)
4. Fill in the values:

```
NEXT_PUBLIC_SUPABASE_URL=        ← paste your Project URL here
NEXT_PUBLIC_SUPABASE_ANON_KEY=   ← paste your anon key here
SUPABASE_SERVICE_ROLE_KEY=       ← paste your service_role key here
ADMIN_PASSWORD=                  ← choose any password for your admin panel
JWT_SECRET=                      ← type any long random string (30+ characters)
```

5. Save the file

---

## STEP 4 — Run the site locally (to test before going live)

1. Open a Terminal (Mac) or Command Prompt (Windows)
2. Navigate to this project folder:
   ```
   cd path/to/shadowraiders
   ```
3. Install dependencies (first time only):
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm run dev
   ```
5. Open your browser and go to: **http://localhost:3000**

You should see the Shadow Raiders website. The admin panel is at **http://localhost:3000/admin**

---

## STEP 5 — Deploy to Vercel (go live)

1. Go to https://github.com and create a free account if you don't have one
2. Create a **New Repository** called `shadowraiders`
3. Upload this project folder to the repository (or use GitHub Desktop for a simpler interface)

4. Go to https://vercel.com and create a free account (sign in with GitHub)
5. Click **Add New Project**
6. Select your `shadowraiders` GitHub repository
7. Click **Deploy** — Vercel will detect it's a Next.js project automatically

**Add your environment variables to Vercel:**
8. After deploying, go to your project → **Settings** → **Environment Variables**
9. Add each variable from your `.env.local` file:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_PASSWORD`
   - `JWT_SECRET`
10. Click **Redeploy** after adding variables

Your site is now live at `https://yourprojectname.vercel.app`

---

## STEP 6 — Optional: Custom domain (e.g. shadowraiders.gg)

1. Buy a domain at Namecheap, GoDaddy, or Google Domains (~$10–15/year)
2. In Vercel, go to your project → **Settings** → **Domains**
3. Add your custom domain and follow the DNS instructions Vercel provides
4. Done — your site will be at your custom domain within a few minutes

---

## Using the Admin Panel

Once live, go to `https://yoursite.com/admin`

- Log in with the `ADMIN_PASSWORD` you set
- **Schedule** — add, edit, or remove upcoming matches
- **Results** — log scores and outcomes after each game
- **Leadership** — update command team bios and roles
- **FAQ** — add or edit FAQ entries

Changes appear on the live site immediately.

---

## Updating the site in future

For content changes (schedule, results, leaders, FAQ): use the admin panel — no code needed.

For design or structural changes: edit the files in the `components/pages/` folder, then push to GitHub. Vercel will automatically redeploy within ~1 minute.

---

## Need help?

If anything goes wrong, the most common issues are:
- Wrong environment variable values — double-check the Supabase keys
- Forgot to run the SQL schema — go back to Step 2 and run the SQL
- `.env.local` not saved — make sure it's in the root of the project folder

---

*Shadow Raiders Alliance · Supremacy WW3 · Tacite et celeriter*
