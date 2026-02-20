<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
<p align="center">
<img width="60" height="68" alt="Storvia Logo" src="https://raw.githubusercontent.com/evershopcommerce/evershop/dev/.github/images/logo-green.png"/>
</p>
<p align="center">
  <h1 align="center">Storvia</h1>
</p>
<h4 align="center">
    <a href="https://evershop.io/docs/development/getting-started/introduction">Documentation</a> |
    <a href="https://demo.evershop.io/">Demo</a>
</h4>

<p align="center">
  <img src="https://github.com/evershopcommerce/evershop/actions/workflows/build_test.yml/badge.svg" alt="Github Action">
  <a href="https://twitter.com/evershopjs">
    <img alt="Twitter Follow" src="https://img.shields.io/twitter/follow/evershopjs?style=social">
  </a>
  <a href="https://discord.gg/GSzt7dt7RM">
    <img src="https://img.shields.io/discord/757179260417867879?label=discord" alt="Discord">
  </a>
  <a href="https://opensource.org/licenses/GPL-3.0">
    <img src="https://img.shields.io/badge/License-GPLv3-blue.svg" alt="License">
  </a>
</p>

<p align="center">
<img alt="Storvia" width="950" src="https://raw.githubusercontent.com/evershopcommerce/evershop/dev/.github/images/banner.png"/>
</p>

## Introduction

Storvia is a modern, TypeScript-first eCommerce platform built with GraphQL and React. Designed for developers, it offers essential commerce features in a modular, fully customizable architecture—perfect for building tailored shopping experiences with confidence and speed.

## Installation Using Docker


You can get started with EverShop in minutes by using the Docker image. The Docker image is a great way to get started with EverShop without having to worry about installing dependencies or configuring your environment.

```bash
curl -sSL https://raw.githubusercontent.com/evershopcommerce/evershop/main/docker-compose.yml > docker-compose.yml
docker-compose up -d
```

For the full installation guide, please refer to our [Installation guide](https://evershop.io/docs/development/getting-started/installation-guide).

## Documentation

- [Installation guide](https://evershop.io/docs/development/getting-started/installation-guide).

- [Extension development](https://evershop.io/docs/development/module/create-your-first-extension).

- [Theme development](https://evershop.io/docs/development/theme/theme-overview).


## Demo

Explore our demo store.

<p align="left">
  <a href="https://demo.evershop.io/admin" target="_blank">
    <img alt="evershop-backend-demo" height="35" alt="EverShop Admin Demo" src="https://raw.githubusercontent.com/evershopcommerce/evershop/dev/.github/images/evershop-demo-back.png"/>
  </a>
  <a href="https://demo.evershop.io/" target="_blank">
    <img alt="evershop-store-demo" height="35" alt="EverShop Store Demo" src="https://raw.githubusercontent.com/evershopcommerce/evershop/dev/.github/images/evershop-demo-front.png"/>
  </a>
</p>
<b>Demo user:</b>

Email: demo@evershop.io<br/>
Password: 123456

## Support

If you like my work, feel free to:

- ⭐ this repository. It helps.
- [![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)][tweet] about EverShop. Thank you!

[tweet]: https://twitter.com/intent/tweet?url=https%3A%2F%2Fgithub.com%2Fevershopcommerce%2Fevershop&text=Awesome%20React%20Ecommerce%20Project&hashtags=react,ecommerce,expressjs,graphql

## Contributing

EverShop is an open-source project. We are committed to a fully transparent development process and appreciate highly any contributions. Whether you are helping us fix bugs, proposing new features, improving our documentation or spreading the word - we would love to have you as part of the EverShop community.

### Ask a question about EverShop

You can ask questions, and participate in discussions about EverShop-related topics in the EverShop Discord channel.

<a href="https://discord.gg/GSzt7dt7RM"><img src="https://raw.githubusercontent.com/evershopcommerce/evershop/dev/.github/images/discord_banner_github.svg" /></a>

### Create a bug report

If you see an error message or run into an issue, please [create bug report](https://github.com/evershopcommerce/evershop/issues/new). This effort is valued and it will help all EverShop users.


### Submit a feature request

If you have an idea, or you're missing a capability that would make development easier and more robust, please [Submit feature request](https://github.com/evershopcommerce/evershop/issues/new).

If a similar feature request already exists, don't forget to leave a "+1".
If you add some more information such as your thoughts and vision about the feature, your comments will be embraced warmly :)


Please refer to our [Contribution Guidelines](./CONTRIBUTING.md) and [Code of Conduct](./CODE_OF_CONDUCT.md).

## License

[GPL-3.0 License](https://github.com/evershopcommerce/evershop/blob/main/LICENSE)

## Project-specific setup (Storvia)

### Backend boot safety fixes

This project includes **minimal, backward-compatible** startup guards so the server does not crash or exit during boot when configuration or database connectivity is temporarily unavailable.

- **What was wrong**: the start script forced `NODE_ENV=production` and migrations could `process.exit(0)` on DB errors.
- **What changed**: `NODE_ENV` is respected if provided (e.g. from `.env`) and migration failures are logged without killing the process.

### Database

Set these environment variables (example is in `Storvia/.env`):

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `NODE_ENV`

### Razorpay (payment integration)

Razorpay is integrated using the official Razorpay Node SDK and is **env-driven** (no hardcoded keys).

Environment variables:

- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- Optional: `RAZORPAY_DISPLAY_NAME`

Flow (keeps existing checkout intact):

- Backend creates a Razorpay order: `POST /api/razorpay/orders`
- Frontend opens Razorpay Checkout after the standard `placeOrder()` completes
- Backend verifies signature: `POST /api/razorpay/verify` and marks the order `paid` (or `failed`)

If the keys are missing:

- Razorpay method is hidden by validator
- Endpoints return a safe error message instead of crashing the server

### AI Chatbot (API-key based, provider-agnostic)

A floating chatbot widget is available on the storefront. The backend endpoint is isolated and will not interfere with existing APIs.

Environment variables:

- `CHATBOT_API_KEY` (if missing, the chatbot falls back to a safe “not configured” response)
- Optional: `CHATBOT_PROVIDER` (`mock` or `openai`)
- Optional: `CHATBOT_MODEL` (used for OpenAI-compatible provider)

Endpoint:

- `POST /api/chatbot/chat`

## Theme: Nike-Inspired

The active storefront theme is a custom Nike-inspired design with the following features:

- **Fonts**: Oswald for headings, Inter for body text
- **Palette**: High-contrast black/white/grey with black as primary interactive color
- **Design**: Sporty, bold typography, clean navigation, modern product cards with hover effects
- **Layout**: Sticky header, big hero banners, responsive grid layouts

### Switching Back to Original Theme

To revert to the original "nike" theme:

1. Edit `config/default.json`
2. Change `"theme": "nike_theme"` to `"theme": "nike"`
3. Run `npm run build`
4. Run `npm start`

### Building Theme Assets

Theme assets are automatically compiled during `npm run build`. For manual theme compilation:

```bash
cd themes/nike_theme
npm run compile
```

### Cache Busting

After theme changes, hard refresh the browser (Ctrl+F5) or clear browser cache to see updates.

