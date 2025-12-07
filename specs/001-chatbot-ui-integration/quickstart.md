# Quickstart: Chatbot UI Integration

## Overview
This guide will help you set up and integrate the Chatkit-based chatbot UI into your Docusaurus documentation project.

## Prerequisites
- Node.js 16+ installed
- Docusaurus project set up
- Basic knowledge of React and JavaScript

## Installation Steps

### 1. Install Dependencies
```bash
npm install @pusher/chatkit-client
# or
yarn add @pusher/chatkit-client
```

### 2. Create Chatbot Component Directory
Create the following directory structure in your Docusaurus project:
```
docs/
└── src/
    └── components/
        └── Chatbot/
            ├── Chatbot.jsx
            ├── Chatbot.css
            └── ChatbotProvider.jsx
```

### 3. Add Chatbot to Layout
Integrate the chatbot component into your Docusaurus layout so it appears on all pages. This can be done by:
- Adding it to the main layout component
- Or using the Docusaurus theme customization feature

### 4. Configure API Endpoints
Set up the API endpoints for:
- Starting chat sessions
- Sending messages to the chatbot
- Retrieving page context

### 5. Environment Variables
Add the following environment variables:
```
CHATKIT_INSTANCE_LOCATOR=your_instance_locator
CHATKIT_KEY=your_key
```

## Basic Usage
The chatbot will automatically appear in the bottom-right corner of all documentation pages. Users can:
- Click to open/close the chat interface
- Type messages in the input field
- Receive context-aware responses based on the current page

## Testing
1. Run your Docusaurus development server: `npm run start`
2. Navigate to any documentation page
3. Verify the chatbot appears in the bottom-right corner
4. Test sending messages and receiving responses
5. Verify context-aware responses work correctly

## Next Steps
- Customize the chatbot UI to match your documentation theme
- Configure the chatbot's knowledge base with your documentation content
- Add analytics to track chatbot usage and effectiveness