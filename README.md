# PrintFlow 3D — 3D Printing Order Management

A full-stack web application for accepting and managing 3D printing orders. Customers can upload 3D model files, configure print settings, and track their orders. Admins have a dedicated console to review, manage, and update order statuses.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: SQLite via Prisma ORM
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **File Upload**: react-dropzone

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up the database

```bash
npx prisma migrate dev
```

### 3. Configure environment variables

Edit `.env` in the project root:

```env
DATABASE_URL="file:./dev.db"
ADMIN_PASSWORD="admin3dprint"
ADMIN_SESSION_SECRET="change-this-to-a-random-secret-in-production"
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pages

| Route | Description |
|---|---|
| `/` | Landing page |
| `/order` | Customer order form (upload file, choose material/color, submit) |
| `/track` | Order tracking by order number |
| `/admin` | Admin login |
| `/admin/dashboard` | Admin dashboard with stats |
| `/admin/orders` | All orders with search and filters |
| `/admin/orders/[id]` | Order detail with status management |

## Admin Console

- **Default password**: `admin3dprint` (change via `ADMIN_PASSWORD` in `.env`)
- Update order status through the workflow: Pending → Reviewing → Quoted → Approved → Printing → Completed → Shipped
- Set estimated prices and add notes visible to customers
- Download uploaded 3D files
- Delete orders

## Supported File Formats

STL, OBJ, 3MF, STEP, STP, IGES, IGS, GCODE (max 100MB)

## Project Structure

```
src/
  app/
    page.tsx                  # Landing page
    order/page.tsx            # Order form
    track/page.tsx            # Order tracking
    admin/
      page.tsx                # Admin login
      dashboard/page.tsx      # Admin dashboard
      orders/page.tsx         # Orders list
      orders/[id]/page.tsx    # Order detail
    api/
      orders/route.ts         # Create & list orders
      orders/[id]/route.ts    # Get, update, delete order
      track/route.ts          # Track order by number
      upload/route.ts         # File upload
      admin/login/route.ts    # Admin authentication
      admin/logout/route.ts   # Admin logout
      admin/stats/route.ts    # Dashboard statistics
      files/[filename]/route.ts # File download (admin only)
  lib/
    prisma.ts                 # Prisma client singleton
    utils.ts                  # Utilities, constants
    auth.ts                   # Admin authentication helpers
prisma/
  schema.prisma               # Database schema
uploads/                      # Uploaded 3D files (gitignored)
```
