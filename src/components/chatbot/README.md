# Chatbot Widget

## Environment variable
Set your OpenAI API key on the server before starting Next.js:

```bash
export OPENAI_API_KEY="your_api_key_here"
```

Or add it to `.env.local`:

```bash
OPENAI_API_KEY=your_api_key_here
```

## Local testing
1. Start development server:
   ```bash
   npm run dev
   ```
2. Open the site and click **Chat with Habib** in the bottom-right corner.
3. Send a message and verify text streams in gradually.

## Disable widget
Remove the `<ChatbotWidget />` mount line from `src/app/layout.tsx`.
