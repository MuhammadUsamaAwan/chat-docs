# Project Setup

## Prerequisites

Make sure you have the following tools installed on your system before proceeding with the setup:

- [Node.js](https://nodejs.org/) (including npm)
- [pnpm](https://pnpm.js.org/) (to install it globally, run `npm i -g pnpm`)
- [Docker](https://www.docker.com/)
- [Ollama](https://ollama.ai)

## Installation

1. Clone the repository to your local machine:

```bash
git clone https://github.com/muhammadusamaawan/chat-docs.git
cd chat-docs
```

1. Install project dependencies using pnpm:

   ```bash
   pnpm i
   ```

1. Push the database:

   ```bash
   pnpm db:push
   ```

1. Bring up the service:

   ```bash
   pnpm chroma:up && docker compose up -d
   ```

1. Start the development server:

   ```bash
   pnpm dev
   ```
