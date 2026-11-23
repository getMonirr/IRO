# IRO Web (Frontend)

Next.js 15 (App Router, `src/` layout) + TypeScript + Tailwind CSS v4। দুই ভাষা: বাংলা (`/bn`) ও ইংরেজি (`/en`)।

```bash
npm install
cp .env.example .env.local
npm run dev        # http://localhost:3000  (Accept-Language অনুযায়ী /bn বা /en-এ যাবে)
```

## ফোল্ডার
- `src/app/[locale]/` পেজ ও লেআউট
- `src/i18n/` locale কনফিগ ও `getT(params)` হেল্পার; `src/middleware.ts` locale redirect
- `src/lib/content/bn.ts`, `en.ts` সব লেখা (কন্টেন্ট + UI স্ট্রিং)। `en.ts` টাইপ-চেক হয় `bn.ts`-এর বিপরীতে, তাই কোনো কী বাদ পড়লে এরর দেবে
- `src/lib/api.ts` ব্যাকএন্ড ক্লায়েন্ট (`?lang=bn|en` পাঠায়)

## নতুন ভাষা বা লেখা যোগ
- নতুন লেখা: `bn.ts` ও `en.ts` দুটিতেই একই কী দিন।
- নতুন ভাষা: `src/i18n/config.ts`-এ locale যোগ করে `src/lib/content/` এ ফাইল বানান এবং `src/i18n/server.ts`-এর `dicts`-এ বসান।

## ব্যাকএন্ড ও ডিফল্ট ডেটা
- সব কন্টেন্ট `iro-api` থেকে আসে: `GET {API}/api/v1/public/content?lang=bn|en` (একটি কলে পুরো সাইটের ডেটা)। Next.js ১ মিনিট ক্যাশ করে।
- API বন্ধ, ধীর (৪ সেকেন্ডের বেশি) বা ভুল ডেটা দিলে `src/lib/content/bn.ts` ও `en.ts` এর ডিফল্ট ডেটা দেখায়, সাইট ভাঙে না।
- `ui` ও `site` গভীরভাবে মার্জ হয় (API-তে কোনো কী না থাকলে ডিফল্ট থাকে)। অন্য তালিকা (programs, stats ইত্যাদি) API থেকে খালি এলে ডিফল্ট দেখায়।
- অ্যাডমিন থেকে পরিবর্তনের সাথে সাথে সাইট আপডেট করতে ব্যাকএন্ডের `REVALIDATE_URL=http://localhost:3000/api/revalidate` ও একই `REVALIDATE_SECRET` সেট করুন।
- যুক্ত হোন ফর্ম `POST /api/v1/join-requests` এ যায়।

## অ্যাডমিন ড্যাশবোর্ড (`/admin`)
- লগইন: `http://localhost:3000/admin`। ব্যাকএন্ডের `SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_PASSWORD` দিয়ে প্রথমবার ঢুকুন, তারপর পাসওয়ার্ড বদলান।
- সেকশন: Programs (বাংলা+ইংরেজি ফর্ম, পয়েন্ট/সংখ্যা/আয়াত), Content items (সংখ্যা, মূলনীতি, লক্ষ্য, বিভাগ, রোডম্যাপ, যুক্ত হওয়ার উপায়), Site texts (সাইট তথ্য, মেনু, সব বাটন/পেজের লেখা), Join requests, Users, Audit log, My account।
- রোল অনুযায়ী মেনু বদলায়: editor কনটেন্ট লিখতে পারে, মুছতে বা সেটিংস/ইউজার ম্যানেজ করতে পারে না। আসল নিয়ম ব্যাকএন্ড চালায়।
- access token মেমরিতে থাকে, refresh token httpOnly কুকিতে। ভিন্ন ডোমেইনে হলে ব্যাকএন্ডে `COOKIE_SAMESITE=none` ও HTTPS লাগবে।
- `/admin` নিজস্ব root layout ব্যবহার করে এবং ভাষা-redirect middleware থেকে বাদ।
