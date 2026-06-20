# Storvia

A modern eCommerce platform built with TypeScript, GraphQL, React, and Node.js.

Storvia is a full-stack commerce application designed to demonstrate modern web development practices, modular architecture, theme customization, and third-party service integrations.

## Features

* Product catalog and product detail pages
* Product search and filtering
* Shopping cart functionality
* Checkout workflow
* User authentication and account management
* Modular theme architecture
* Razorpay payment integration support
* AI chatbot integration support
* Environment-based configuration
* Responsive design

## Tech Stack

### Frontend

* React
* TypeScript
* GraphQL
* SCSS

### Backend

* Node.js
* GraphQL API
* PostgreSQL

### Integrations

* Razorpay
* AI Chatbot APIs

## Project Structure

```text
StorviaV2/
├── packages/
├── themes/
├── public/
├── config/
├── media/
└── extensions/
```

## Getting Started

### Prerequisites

* Node.js 18+
* npm
* PostgreSQL

### Clone Repository

```bash
git clone https://github.com/PranayWare/StorviaV2.git
cd StorviaV2
```

### Configure Environment

Create a `.env` file:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=storvia_db

NODE_ENV=development

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

CHATBOT_API_KEY=
CHATBOT_PROVIDER=mock
```

### Install Dependencies

```bash
npm install
```

### Build Project

```bash
npm run build
```

### Run Application

```bash
npm start
```

The application will be available at:

```text
http://localhost:3000
```

## Payment Integration

Storvia includes Razorpay integration support. Configure your Razorpay credentials in the environment file to enable payment functionality.

## AI Chatbot

The chatbot module supports API-based providers through environment configuration. If no API key is provided, the chatbot will remain disabled.

## Theme System

The project includes a custom Nike-inspired theme featuring:

* Oswald typography for headings
* Inter typography for body text
* High-contrast black and white design
* Responsive layout
* Modular styling architecture

## Learning Objectives

* Full-stack application development
* GraphQL API implementation
* Database integration
* Payment gateway integration
* Theme customization
* Modern deployment workflows

## Status

Active development and customization project based on the Evershop ecosystem.
