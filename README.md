# 💬 Chatty — Real-Time Group Messaging & Communication Engine

> **Real-Time Group Messaging & Communication Engine** — a high-throughput instant messaging system supporting concurrent group channels, message forwarding, reply threading, presence tracking, and cloud media pipelines.

A full-stack, real-time chat application (**Chatty**) with instant 1:1 and group messaging, live presence, typing indicators, read receipts, emoji reactions, media sharing, auth via JWT / Google OAuth, and **audio/video calling over WebRTC** — all pushed through **Socket.io** for sub-50ms bidirectional message sync.

---

## ✨ Features

### 💬 Real-Time Messaging (Socket.io)
- **Direct (1:1) chats and group chats** — real-time bidirectional delivery.
- **Sub-50ms latency** message synchronization across active rooms (Redux optimistic updates give instant feedback).
- **Typing indicators** — `typing` / `userTyping`, `stopTyping` / `userStopTyping`.
- **Read receipts** — messages silently marked `seen` with `seen_at` via `messageSeen` / `messageSeenUpdate`.
- **Online presence** — live `getOnlineUsers` broadcast, online/offline dots everywhere.

### 📝 Message Tooling
- **Emoji reactions** — add/remove reactionsin realtime with the Emoji Mart picker (`newEmoji` / `removeEmoji`).
- **Edit / Delete** messages (soft-delete, `editMessage` / `deletedMessage` events).
- **Reply threading** — quoted replies with `reply_id` chains.
- **Forward messages** — re-share messages to any chat (`forwardMessage` event).
- **Clear chat & delete all** — per-conversation hygiene.

### 👥 Group Chats
- **Create groups** — name, description, image/avatar.
- **Group administration** — add/remove members, **member roles（admin / member）**, promote/reassign admins with automatic admin hand-off on leave.
- **Group invitations** — email-based pending invitations + accept flow.
- **Update / leave / delete groups** — full lifecycle with live `groupCreated` / `groupMemberChanged` / `groupUpdated` / `groupDeleted` socket events.
- **Group message feeds** — separate group timelines + realtime `newGroupMessage`.
- **Disappearing messages** — per-user `off / 24h / 7d / 30d`, auto-expired server-side.

### 🔐 Auth, Accounts & Safety
- **JWT authentication** — protected routes via express middleware.
- **Google OAuth 2.0** — sign-in / register with Google.
- **Email + password signup** with one-time **email confirmation** links (Nodemailer / SMTP).
- **Forgot / reset password** — email PIN + secure token flow.
- **Invite friends by email** — accept-invite flow, friend list, accept/decline.
- **Block / unblock contacts** — blocked users are barred from messaging and calling.
- **Profile management** — name, avatar, bio, settings (theme, wallpaper, font size, compact list).
- **QR code connect** — show your code / scan another users code with camera or file import.

### 🖼️ Media & Files
- **Cloud media pipeline** — Multer in-memory uploads (10 MB cap) → **Cloudinary**, for images, videos, and PDFs (raw resource type).
- **Shared conversation media viewer** — browse all media/PDFs in a chat (`GET /api/message/shared`).
- **Inline previews** — PDFs, images, videos render directly in the message thread.

### 📞 Audio & Video Calls (WebRTC)
- **Audio calls and video calls** between accepted friends (toggle via `VITE_CALL_ENABLED`).
- **Socket.io signaling** — `webrtc:offer` / `webrtc:answer` / `webrtc:ice-candidate` relays, plus full lifecycle: `call:starting`, `call:incoming`, `call:accepted`, `call:rejected`, `call:missed`, `call:timeout`, `call:ended`.
- **Call history & logs** — every call tracked in PostgreSQL (`call_logs`: received / rejected / missed / completed, with durations).
- **Configurable ring timeout** (`CALL_RING_TIMEOUT_MS` — missed-call auto-finalize). Offline callee → instant missed-call log.
- **STUN / TURN configurable** — Google STUN out-of-the-box; optional TURN relay for strict NATs.
- **Polished call UI** — incoming/outgoing overlays with Framer Motion animations.

### 🎨 UI / UX
- **React + TypeScript + Vite**, Material UI (MUI), **Framer Motion** animations, **Emoji Mart** picker.
- **Dark / light themes**, custom wallpapers, compact list, font sizes — persisted via Redux + server sync.
- **Smart text suggestions** — Harper.js-powered spelling, grammar,and word-completion popup (Bangla-safe: Bangla text passes through untouched).
- **Debounced search** across chats/contacts, date-grouped message timelines, Toast notifications.
- **Landing pages** — Features, How It Works, Preview, Testimonials.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| --- | --- |
| **Frontend** | React 18, TypeScript, Vite, Redux Toolkit (optimistic updates), MUI, Framer Motion, Emoji Mart, Harper.js, qrcode, socket.io-client |
| **Backend** | Node.js, Express, TypeScript, Socket.io, JWT, bcrypt, Nodemailer, Multer, Cloudinary |
| **Database** | PostgreSQL (primary — users, friendships, group_members, messages, call_logs; with migrations and indexed queries), pg Pool |
| **Auth** | JWT + Google OAuth 2.0 + email confirmation |
| **DevOps / Deploy** | Docker (multi-stage), docker-compose, Render Blueprint (nginx load-balancer + frontend + backend), nginx WebSocket upgrade proxying |

## 🧠 Architecture & Performance

- **Architecture details**: Built with a PostgreSQL-first data model - users, friendships, group memberships, messages(with reply threading)and call logs all live in PostgreSQL, accessed through parameterized queriesand managed with versioned migrations;the React client uses Redux Toolkit optimistic updates for instant message feedback.
- **Challenge tackled**: Managing sub-50ms bi-directional message synchronization across active group rooms while keeping user sessions synchronized with JWT and handling concurrent media upload streams.
- **Performance**: Implemented optimized PostgreSQL queries, Redux optimistic updates, and Google OAuth, JWT authentication.

## 🚀 Getting Started (Local)

### Prerequisites
- Node.js (20+), npm, a PostgreSQL database (or Docker), anda Cloudinary + SMTP account for full functionality.

### 1. Clone & install
```sh
git clone https://github.com/Shihab2027/chat-app.git
cd chat-app

# Backend
cd back-end
npm ci
cp #envSample .env            # then fill in real credentials

# Frontend (new terminal)
cd ../front-end
npm ci
cp #envSample .env
```

### 2. Configure `.env`
- **Backend** (`back-end/.env`): `PORT`, `DATABASE_URL` (PostgreSQL), `FRONT_END_BASE_URL`, `JWT_ACCESS_SECRET`, SMTP creds, optional `CALL_RING_TIMEOUT_MS`, `CALL_HISTORY_LIMIT` — see `back-end/#envSample`.
- **Frontend** (`front-end/.env`): `VITE_BASE_API_URL`, `VITE_GOOGLE_CLIENT_ID`, and calling vars (`VITE_CALL_ENABLED` etc.) — see `front-end/#envSample`.

### 3. Run
```sh
# backend (uses PostgreSQL — migrations run via `npm run migrate`)
cd back-end && npm run dev

# frontend (new terminal)
cd front-end && npm run dev
```

## ☁️ Deploying on Render (incl. Socket.io)
The app is a 3-service architecture: public **nginx load-balancer** (proxies `/api/*` and `/socket.io/*` with WebSocket upgrades), internal **frontend** (nginx SPA), and internal **backend** (Socket.io/Express on port 5000).

**Critical env vars (see `render.yaml`):**
- Backend: `PORT`, `DATABASE_URL`, `FRONT_END_BASE_URL` (= public URL — used for Socket.io CORS).
- Frontend (build-time args): `VITE_BASE_API_URL` (= `<public>/api`), `VITE_GOOGLE_CLIENT_ID`, `VITE_CALL_ENABLED`.

The nginx load-balancer already handles the WebSocket `Upgrade` handshake (see `.docker/loadbalancer-nginx.conf`), so Socket.io works through HTTPS in production.

## 📡 API & Socket Highlights

**REST modules** — `/api/user/*` (auth, friends, block, profile), `/api/message/*` (messages, groups, media), `/api/call/*` (history, logs).

**Socket events** — `newMessage`, `newGroupMessage`, `typing`/`userTyping`, `stopTyping`/`userStopTyping`, `messageSeen`/`messageSeenUpdate`, `getOnlineUsers`, `newEmoji`/`removeEmoji`, `editMessage`, `deletedMessage`, `forwardMessage`, `groupCreated`, `groupMemberChanged`, `groupUpdated`, `groupDeleted`, `call:start/accept/reject/end`, `webrtc:offer/answer/ice-candidate`.

## 🧩 Project Card (JSON)
See **`chatty-app.json`** in the repo root — a ready-to-use project/portfolio card with full tech breakdown, features, challenges,and accomplishments. A plain-text feature sheet is also available in **`CHATTY_FEATURES.txt`**.

## 🔗 Links
- **GitHub**: https://github.com/Shihab2027/chat-app
- **Live**: https://chat-apcel.app/

---
Made with ❤️ — Chatty
