# VforVanilla

A personal reference tool for a VMaNGOS "Progressive Vanilla" WoW 1.12 server. It browses the
server's actual item database and hosts hand-curated Best-in-Slot guides, so you don't have to
tab out to a browser mid-raid to check gear or a rotation.

## Features

- **Item database browser** — search and filter by category, subclass, equip slot, quality, and
  required level, backed directly by the server's `item_template` table. Filtering understands
  the real data model (e.g. Weapon subclasses grouped into One-Handed/Two-Handed/Ranged/Other,
  Armor split into Types/Jewelry/Relics/Other), not just a flat dropdown of raw enum values.
  Each item has a detail page with stats, sockets, spell effects, and known drop sources.
- **Best-in-Slot guides** — phase-by-phase gear lists (Pre-Raid through Phase 6) for every
  raid-viable Vanilla spec, each item linked straight to its entry in the item browser above.
  Every guide also includes a recommended talent build screenshot, an Introduction/Rotation
  writeup, and a Best Consumables section.

## Tech stack

- **Frontend**: React 19, TypeScript, Vite, React Router v7, Axios, Framer Motion, Font Awesome
- **Backend**: Node.js (ES Modules), Express 5, Prisma ORM with `@prisma/adapter-mariadb`
- **Database**: MySQL 5.6, running the world database from a VMaNGOS "Progressive Vanilla" server

## Prerequisites

- Node.js
- Docker Desktop
- A VMaNGOS `mangos` world database dump (this repo doesn't include one — bring your own from
  your server install)

## Setup

1. **Clone and install dependencies**

   ```bash
   git clone <this-repo-url>
   cd VforVanilla
   npm install
   ```

2. **Start the database**

   Create a MySQL 5.6 container and import your `mangos` world DB dump into it:

   ```bash
   docker run -d --name vforvanilla-mysql \
     -e MYSQL_ROOT_PASSWORD=root \
     -p 3307:3306 \
     -v vforvanilla-mysql-data:/var/lib/mysql \
     mysql:5.6

   # once it's healthy:
   docker exec -i vforvanilla-mysql mysql -uroot -proot -e "CREATE DATABASE mangos;"
   docker exec -i vforvanilla-mysql mysql -uroot -proot mangos < /path/to/your/mangos-dump.sql
   ```

   If you already have this container from a previous setup, just make sure it's running:
   `docker start vforvanilla-mysql`.

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Fill in `DATABASE_URL` to point at the container above, e.g.
   `mysql://root:root@localhost:3307/mangos`. The other variables in `.env.example` already have
   sensible local defaults.

4. **Generate the Prisma client**

   The schema was introspected from the live database (`prisma db pull`), not migration-managed,
   so there's no `migrate` step to run against it — just generate the client:

   ```bash
   npx prisma generate
   ```

5. **Run it**

   ```bash
   npm run dev:app
   ```

   This starts the Vite frontend and the Express API together. The app runs at
   `http://localhost:5173`, with the API on `http://localhost:3000`.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Frontend only (Vite) |
| `npm run dev:backend` | Backend only (Express API) |
| `npm run dev:app` | Both, concurrently — what you want for local development |
| `npm run build` | Type-check and build the frontend for production |
| `npm run lint` | ESLint |
| `npm run preview` | Preview the production build locally |
