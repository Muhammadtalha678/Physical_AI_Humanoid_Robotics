# Chatbot Integration Guide

## Overview

This guide explains how the AI chatbot is integrated into the Physical AI & Humanoid Robotics documentation site. The chatbot provides contextual assistance to users as they navigate through the documentation.

## Architecture

The chatbot implementation consists of several key components:

1. **UI Component**: A React component that appears as a floating chat interface in the bottom-right corner of every page
2. **State Management**: A React context provider that manages chat state, sessions, and messages
3. **API Service**: A service layer that communicates with the backend chat API
4. **Layout Integration**: A Docusaurus theme wrapper that adds the chatbot to all pages

## Components

### Chatbot Component (`docs/src/components/Chatbot/Chatbot.jsx`)

The main chat interface that users interact with. Features include:
- Fixed positioning in the bottom-right corner
- Open/close/minimize functionality
- Message input and display
- Loading states and error handling

### Chatbot Provider (`docs/src/components/Chatbot/ChatbotProvider.jsx`)

Manages the chatbot state using React's Context API and useReducer hook. Key responsibilities:
- Managing chat sessions
- Storing and updating messages
- Tracking page context
- Providing data structure creation functions

### API Service (`docs/src/services/chatbot-api.js`)

Handles communication with the backend API. Functions include:
- Starting chat sessions
- Sending messages
- Retrieving page context
- Extracting content and keywords from pages

## API Endpoints

The chatbot communicates with the following API endpoints:

- `POST /api/chat/start-session` - Initialize a new chat session
- `POST /api/chat/send-message` - Send a message and receive a response
- `GET /api/chat/get-context` - Retrieve context for the current page

## Integration

The chatbot is integrated into all pages through the custom Layout wrapper at `docs/src/theme/Layout.jsx`. This ensures the chatbot appears consistently across the entire documentation site.

## Context Awareness

The chatbot automatically detects the current page context and uses this information to provide more relevant responses. It extracts:
- Page URL
- Page title
- Page content
- Page keywords

## Customization

To customize the chatbot's appearance, modify the CSS file at `docs/src/components/Chatbot/Chatbot.css`.

To modify the chatbot's behavior, update the component logic in `docs/src/components/Chatbot/Chatbot.jsx`.

## Troubleshooting

### Chatbot Not Appearing

- Verify that the Layout wrapper is properly implemented
- Check that the ChatbotProvider is wrapping the main layout
- Ensure the component files are in the correct locations

### API Communication Issues

- Verify that the API endpoints are accessible
- Check browser console for network errors
- Ensure the API service is properly configured