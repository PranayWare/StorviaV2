# Storvia (EverShop) - Complete Setup Guide

This guide will walk you through setting up the Storvia e-commerce platform from scratch on a new system.

## Table of Contents
- [System Requirements](#system-requirements)
- [Prerequisites Installation](#prerequisites-installation)
- [Project Setup](#project-setup)
- [Database Configuration](#database-configuration)
- [Building and Running](#building-and-running)
- [Admin User Creation](#admin-user-creation)
- [Shipping Configuration](#shipping-configuration)
- [Troubleshooting](#troubleshooting)

---

## System Requirements

### Minimum Requirements
- **OS**: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 20.04+)
- **RAM**: 4GB minimum (8GB recommended)
- **Storage**: 2GB free space
- **Internet**: Required for initial setup

---

## Prerequisites Installation

### 1. Node.js (Required)
**Compatible Version**: Node.js v18.x or v20.x (LTS versions)

#### Windows:
1. Download installer from: https://nodejs.org/
2. Run the installer (choose v20.x LTS)
3. Verify installation:
```cmd
node --version
npm --version
```

#### macOS:
```bash
# Using Homebrew
brew install node@20

# Verify installation
node --version
npm --version
```

#### Linux (Ubuntu/Debian):
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 2. PostgreSQL Database (Required)
**Compatible Version**: PostgreSQL 14.x, 15.x, or 16.x

#### Windows:
1. Download installer from: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
2. Run installer (PostgreSQL 16.x recommended)
3. During installation:
   - Set password for postgres user (remember this!)
   - Port: 5432 (default)
   - Locale: Default
4. Verify installation:
```cmd
psql --version
```

#### macOS:
```bash
# Using Homebrew
brew install postgresql@16

# Start PostgreSQL service
brew services start postgresql@16

# Verify installation
psql --version
```

#### Linux (Ubuntu/Debian):
```bash
# Add PostgreSQL repository
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -

# Install PostgreSQL
sudo apt-get update
sudo apt-get install -y postgresql-16

# Verify installation
psql --version
```

### 3. Git (Recommended)
**Compatible Version**: Git 2.30+

#### Windows:
Download from: https://git-scm.com/download/win

#### macOS:
```bash
brew install git
```

#### Linux:
```bash
sudo apt-get install -y git
```

---

## Project Setup

### 1. Clone/Download the Project
```bash
# If using Git
cd /path/to/your/projects
git clone https://github.com/PranayWare/Storvia.git
cd Storvia

# Or extract downloaded ZIP file to desired location
```

### 2. Install Project Dependencies
```bash
# Install all dependencies (this may take 5-10 minutes)
npm install

# If you encounter permission errors on macOS/Linux, use:
sudo npm install --unsafe-perm=true --allow-root
```

---

## Database Configuration

### 1. Create PostgreSQL Database

#### Option A: Using PostgreSQL Command Line (psql)

**Windows:**
```cmd
# Open Command Prompt or PowerShell
# Connect to PostgreSQL (enter password when prompted)
psql -U postgres -h localhost

# In psql prompt, run:
CREATE DATABASE storvia;

# Verify database created
\l

# Exit psql
\q
```

**macOS/Linux:**
```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database
CREATE DATABASE storvia;

# Verify database created
\l

# Exit psql
\q
```

#### Option B: Using pgAdmin (GUI Tool)

1. Open pgAdmin (installed with PostgreSQL)
2. Connect to local PostgreSQL server
3. Right-click "Databases" → "Create" → "Database"
4. Name: `storvia`
5. Click "Save"

### 2. Configure Database Connection

Create a `.env` file in the project root directory:

```bash
# Windows
type nul > .env

# macOS/Linux
touch .env
```

Open `.env` file and add the following configuration:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_postgres_password_here
DB_NAME=storvia

# Environment
NODE_ENV=development

# Optional: Session Secret (for production)
# SESSION_SECRET=your-secret-key-here
```

**Important:** Replace `your_postgres_password_here` with your actual PostgreSQL password.

---

## Building and Running

### 1. Compile TypeScript Files
```bash
# Compile workspace packages (postgres-query-builder)
cd packages/postgres-query-builder
npm install
npm run compile
cd ../..

# Compile main package
npm run compile
```

Expected output: Should see compilation success for ~1200+ files

### 2. Build Frontend Assets
```bash
npm run build
```

This compiles React components and generates production assets.

### 3. Start the Application

#### Development Mode (with auto-reload):
```bash
npm run dev
```

#### Production Mode:
```bash
npm start
```

### 4. Access the Application

Once started, open your browser and navigate to:

- **Storefront**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin

---

## Admin User Creation

### Create Your First Admin User

After the server is running, open a **new terminal/command prompt** and run:

```bash
npm run user:create -- --email admin@example.com --password Admin@123 --name "Admin User"
```

**Parameters:**
- `--email`: Your admin email address
- `--password`: Admin password (min 8 characters)
- `--name`: Display name for admin

**Example:**
```bash
npm run user:create -- --email john@storvia.com --password SecurePass123! --name "John Doe"
```

### Login to Admin Panel

1. Navigate to: http://localhost:3000/admin
2. Enter your admin credentials
3. You should be logged in to the admin dashboard

---

## Shipping Configuration

### 1. Create Shipping Zone

1. Login to Admin Panel
2. Navigate to **Settings** → **Shipping** (or http://localhost:3000/admin/settings/shipping)
3. Click **"Create Zone"** button
4. Fill in zone details:
   - **Zone Name**: e.g., "United States", "India", "Europe"
   - **Country**: Select country
   - **Provinces/States**: (Optional) Select specific regions
5. Click **"Save"**

### 2. Add Shipping Methods to Zone

1. In the shipping zones list, click on your created zone
2. Click **"Add Method"** button
3. Fill in method details:
   - **Method Name**: e.g., "Standard Shipping", "Express Delivery"
   - **Calculation Type**: 
     - Fixed Cost
     - Price Based
     - Weight Based
   - **Cost**: Enter shipping cost (e.g., 100)
4. Click **"Save"**

### 3. Test Shipping in Checkout

1. Add products to cart on storefront
2. Proceed to checkout
3. Enter shipping address with country/province from your shipping zone
4. You should see your shipping methods available for selection

---

## Payment Methods Setup

### Cash on Delivery (COD)

COD is enabled by default. To configure:

1. Login to Admin Panel
2. Navigate to **Settings** → **Payment Methods**
3. Enable/configure "Cash on Delivery"

### Other Payment Methods

The platform supports:
- **PayPal**: Configure via Settings → Payment Methods → PayPal
- **Stripe**: Configure via Settings → Payment Methods → Stripe

---

## Project Structure

```
Storvia/
├── config/                 # Configuration files
│   └── default.json       # Default app configuration
├── extensions/            # Extension modules
│   ├── agegate/
│   ├── product_review/
│   ├── resend/
│   └── ...
├── packages/
│   ├── evershop/          # Main EverShop package
│   │   └── src/
│   │       ├── modules/   # Core modules (checkout, catalog, etc.)
│   │       └── components/
│   ├── postgres-query-builder/
│   └── create-evershop-app/
├── public/                # Static assets
├── themes/                # Theme files
│   └── eve/              # Active theme
├── .env                   # Environment configuration (you create this)
├── package.json           # Project dependencies
└── docker-compose.yml     # Docker configuration (optional)
```

---

## Troubleshooting

### Common Issues and Solutions

#### 1. Port Already in Use
**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

#### 2. PostgreSQL Connection Failed
**Error:** `ECONNREFUSED` or `Connection refused`

**Solutions:**
- Verify PostgreSQL is running:
  ```bash
  # Windows
  sc query postgresql-x64-16
  
  # macOS
  brew services list
  
  # Linux
  sudo systemctl status postgresql
  ```
- Check `.env` file credentials are correct
- Verify PostgreSQL is listening on port 5432

#### 3. Database Does Not Exist
**Error:** `database "storvia" does not exist`

**Solution:**
Create the database:
```bash
psql -U postgres -c "CREATE DATABASE storvia;"
```

#### 4. npm install Fails
**Error:** Various npm errors

**Solutions:**
- Clear npm cache:
  ```bash
  npm cache clean --force
  ```
- Delete `node_modules` and `package-lock.json`:
  ```bash
  # Windows
  rmdir /s /q node_modules
  del package-lock.json
  
  # macOS/Linux
  rm -rf node_modules package-lock.json
  ```
- Run `npm install` again

#### 5. Compilation Errors
**Error:** TypeScript compilation errors

**Solution:**
```bash
# Clean build
npm run clean

# Rebuild
npm run compile && npm run build
```

#### 6. Theme Not Found
**Error:** `Theme 'eve' does not exist`

**Solution:**
Ensure theme directory exists:
```bash
# Create theme structure if missing
mkdir -p themes/eve/pages/all
```

#### 7. Admin User Creation Fails
**Error:** Cannot create admin user

**Solution:**
- Ensure database connection is working
- Check if user already exists
- Verify email format is valid

#### 8. Checkout - No Payment Method Available
**Error:** Payment methods not showing

**Solution:**
- Verify at least one payment method is enabled in admin settings
- Check console for JavaScript errors
- Clear browser cache and reload

#### 9. Shipping Methods Not Showing
**Error:** No shipping methods available at checkout

**Solution:**
- Ensure shipping zone is created for the customer's country
- Add at least one shipping method to the zone
- Verify the shipping address country matches a configured zone

---

## Docker Setup (Alternative Method)

If you prefer using Docker:

### Prerequisites
- Docker Desktop (Windows/macOS) or Docker Engine (Linux)
- Docker Compose

### Using Docker

1. Start services:
```bash
docker-compose up -d
```

2. Access application:
- Storefront: http://localhost:3000
- PostgreSQL: localhost:5432

3. Stop services:
```bash
docker-compose down
```

---

## Development Commands Reference

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Build frontend assets
npm run build

# Start development server (with hot reload)
npm run dev

# Start production server
npm start

# Create admin user
npm run user:create -- --email <email> --password <password> --name "<name>"

# Run tests (if available)
npm test

# Clean build artifacts
npm run clean
```

---

## Production Deployment Checklist

Before deploying to production:

- [ ] Set `NODE_ENV=production` in `.env`
- [ ] Generate strong `SESSION_SECRET` in `.env`
- [ ] Use production PostgreSQL database (not localhost)
- [ ] Configure reverse proxy (Nginx/Apache)
- [ ] Set up SSL certificate (HTTPS)
- [ ] Configure domain name
- [ ] Set up database backups
- [ ] Configure email service (for notifications)
- [ ] Test payment gateway in production mode
- [ ] Review security settings
- [ ] Set up monitoring and logging

---

## Support and Resources

### Official Documentation
- EverShop Docs: https://evershop.io/docs
- PostgreSQL Docs: https://www.postgresql.org/docs/

### Getting Help
- Check existing issues: https://github.com/PranayWare/Storvia/issues
- Community forums
- Stack Overflow (tag: evershop)

---

## Version Information

- **EverShop**: v1.2.2
- **Node.js**: v18.x or v20.x (LTS)
- **PostgreSQL**: v14.x, v15.x, or v16.x
- **npm**: v9.x or v10.x

---

## Next Steps

After completing setup:

1. ✅ Configure store settings (Settings → General)
2. ✅ Set up shipping zones and methods
3. ✅ Configure payment methods
4. ✅ Add product categories
5. ✅ Create products
6. ✅ Customize theme (optional)
7. ✅ Test complete checkout flow
8. ✅ Set up email templates

---

## License

Check LICENSE file in the project root.

---

**Last Updated:** January 2026
**Author:** Storvia Team
**Project:** https://github.com/PranayWare/Storvia
