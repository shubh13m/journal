# 🪶 JournoSpace — Full Roadmap Checklist

> A Django + React journaling app with a clean, scalable roadmap from MVP to advanced extensions.

---

## ✅ Version 1 — Core Functionality (MVP)
Basic journaling and authentication setup.

- [x] User authentication (JWT login / signup)
- [x] Create, read, update, delete (CRUD) journals
- [x] Journal visibility (Public, Private)
- [x] Backend API with Django REST Framework
- [x] Frontend integration with React
- [x] Basic UI for viewing and adding journals
- [x] Save author on create
- [x] Display journals list
- [x] View individual journal
- [x] Token-based login & persistence (localStorage)
- [x] Logout and state reset

---

## 🚀 Version 2 — Social & Visibility Features
Introduce the **Three-Tier Journal Visibility Model** and social features.

### 🔒 Three-Tier Journal Visibility Model
- [x] **Public:** visible to everyone (logged in or not)
- [x] **Friends:** visible to mutual followers
- [x] **Specific:** visible only to manually selected users  
- [ ] Backend visibility filtering logic
- [ ] Multi-select user picker for "Specific"
- [ ] Visibility badges/icons in UI

### 👥 Social Layer
- [ ] Follow / Unfollow system
- [ ] Mutual-followers detection for “Friends” visibility
- [ ] Followers & Following list pages
- [ ] User mini-profile display (username, avatar)
- [ ] UserList endpoint (with token auth)
- [ ] Show username/author in each journal card

---

## ✨ Version 3 — Experience & Interaction
Improve usability and engagement.

- [ ] Likes / Reactions system
- [ ] Commenting (optional)
- [ ] Notifications:
  - [ ] When someone follows you
  - [ ] When a post is shared specifically with you
- [ ] Create Account and Login as separate pages
- [ ] Add timestamps (`created_at`, `updated_at`)
- [ ] Pagination / Lazy loading (avoid loading all journals)
- [ ] Auto-load visible journals dynamically (like Instagram feed)
- [ ] Responsive layout (mobile/tablet/desktop)
- [ ] Improve overall UI layout and design polish

---

## 🧭 Version 4 — Productivity & Writing Tools
Enhance journaling experience and control.

- [ ] Draft mode (save but don’t publish)
- [ ] Auto-save drafts (every few seconds)
- [ ] Rich text editor (bold, italics, links, etc.)
- [ ] Anonymous posting option
- [ ] Rate limiting (anti-spam protection)
- [ ] Profile settings page
- [ ] Default visibility setting per user
- [ ] “My Activity” page (recent journals, likes, etc.)

---

## 🌙 Version 5 — Personalization & Insights
Make it feel alive and personalized.

- [ ] Dark / Light theme toggle
- [ ] Streak counter (track consecutive journaling days)
- [ ] Journal stats dashboard:
  - [ ] Total posts
  - [ ] Public/Friends/Specific ratio
  - [ ] Engagement metrics (likes/comments)
- [ ] Offline mode + sync (PWA or localStorage)
- [ ] JWT refresh / auto-renew flow
- [ ] Export journals (PDF / Markdown)
- [ ] Profile page with bio, join date, and avatar upload

---

## 🧩 Extensions (Advanced & Future Ideas)
Optional long-term upgrades — can be planned later.

### 🔐 Security & Data
- [ ] End-to-end encryption for private journals
- [ ] 2FA (two-factor authentication)
- [ ] Data backup and recovery system

### 🧠 AI & Smart Features
- [ ] Smart suggestions / daily writing prompts
- [ ] Mood or sentiment tracking via AI
- [ ] Journal summarization or insights
- [ ] Keyword / tag extraction for search

### 🌐 Social & Community
- [ ] Explore / Discover public journals
- [ ] Public profiles with shareable links
- [ ] Hashtag system for topics
- [ ] Group journaling or team spaces

### ⚙️ Scalability & Tech
- [ ] Caching and query optimization
- [ ] Background jobs (Celery / Redis)
- [ ] Full PWA setup
- [ ] WebSocket live updates (real-time notifications)

---

## 🗂️ Structure Summary

| Version | Theme                     | Focus Area                            |
|:--------|:--------------------------|:--------------------------------------|
| V1      | Core                      | Basic CRUD + Auth                     |
| V2      | Social & Visibility       | Three-tier visibility + Follow system |
| V3      | Interaction & UX          | Likes, Notifications, Pagination      |
| V4      | Writing & Productivity    | Drafts, Rich Text, Settings           |
| V5      | Personalization & Insights| Themes, Stats, Offline, Export        |
| Ext.    | Future Extensions          | AI, Security, Scalability, Community  |

---

✅ **Next Action:**  
You’re currently at **Version 1 complete → starting Version 2 (Social & Visibility)**.
Focus next on:
- Follow model  
- Friends-visibility filtering  
- User multi-select for “Specific”  
- Frontend icons for visibility badges