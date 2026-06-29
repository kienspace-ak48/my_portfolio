# Personal Portfolio — Kien's Space

Website portfolio cá nhân full-stack: React SPA phía frontend và Express API phía backend. Frontend được build vào `backend/dist` và phục vụ bởi cùng một server Node.js.

## Tech stack

| Layer | Công nghệ |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite 8, Tailwind CSS 4, React Router |
| Backend | Node.js, Express 5, Mongoose |
| Package manager | pnpm |

## Cấu trúc thư mục

```
personal_portfolio/
├── backend/          # Express server, API, phục vụ static SPA
│   ├── server.js
│   ├── src/
│   └── dist/         # Output build frontend (tự sinh, không commit)
├── frontend/         # React + Vite
│   └── src/
├── .gitignore
└── README.md
```

## Yêu cầu

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 11+

## Cài đặt

```bash
# Clone repository
git clone https://github.com/<username>/personal_portfolio.git
cd personal_portfolio

# Cài dependencies backend
cd backend
pnpm install

# Cài dependencies frontend
cd ../frontend
pnpm install
```

## Cấu hình môi trường

Tạo file `backend/.env`:

```env
HTTP_PORT=3000
NODE_ENV=development
# MONGODB_URI=mongodb://localhost:27017/personal_portfolio
```

> Không commit file `.env`. Chỉ đẩy biến mẫu (nếu có) qua `.env.example`.

## Chạy development

Mở **hai terminal** song song:

**Terminal 1 — Frontend (Vite dev server):**

```bash
cd frontend
pnpm dev
```

**Terminal 2 — Backend (nodemon):**

```bash
cd backend
pnpm dev
```

Backend mặc định chạy tại `http://localhost:3000`.

## Build production

Build frontend vào `backend/dist`, sau đó chạy server:

```bash
cd backend
pnpm run build:frontend
pnpm start
```

Hoặc build thủ công từ thư mục frontend:

```bash
cd frontend
pnpm build
cd ../backend
pnpm start
```

## Scripts hữu ích

### Backend (`backend/`)

| Script | Mô tả |
|--------|--------|
| `pnpm dev` | Chạy server với nodemon |
| `pnpm start` | Chạy server production |
| `pnpm run build:frontend` | Cài deps & build frontend vào `backend/dist` |

### Frontend (`frontend/`)

| Script | Mô tả |
|--------|--------|
| `pnpm dev` | Vite dev server |
| `pnpm build` | Type-check + build production |
| `pnpm lint` | Chạy ESLint |
| `pnpm preview` | Xem trước bản build |

## License

ISC
