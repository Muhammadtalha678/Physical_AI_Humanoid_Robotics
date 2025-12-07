import React, { useState, useEffect } from 'react';
import { useChatbot } from './ChatbotProvider';
import Chatkit from '@pusher/chatkit-client';
import chatbotApiService from '../../services/chatbot-api';
import './Chatbot.css';

const Chatbot = () => {
  const {
    isOpen,
    toggleChatbot,
    isLoading,
    currentSession,
    messages,
    setLoading,
    setSession,
    addMessage,
    updateSessionPage,
    createNewMessage,
    createNewInput,
    createNewResponse,
    createNewSession,
  } = useChatbot();

  const [inputValue, setInputValue] = useState('');
  const [chatkitInstance, setChatkitInstance] = useState(null);

  // Initialize Chatkit when chat is first opened
  useEffect(() => {
    if (isOpen && !currentSession) {
      // Create a new session when chat is opened
      const newSession = createNewSession(`session-${Date.now()}`, null, window.location.pathname);
      setSession(newSession);

      // Initialize Chatkit if available
      initializeChatkit(newSession.sessionId);
    }
  }, [isOpen, currentSession, setSession, createNewSession]);

  // Initialize Chatkit instance
  const initializeChatkit = async (sessionId) => {
    if (!process.env.REACT_APP_CHATKIT_INSTANCE_LOCATOR || !process.env.REACT_APP_CHATKIT_KEY) {
      console.warn('Chatkit environment variables not set. Using fallback API service.');
      return;
    }

    try {
      setLoading(true);

      const chatkit = await Chatkit.connect({
        instanceLocator: process.env.REACT_APP_CHATKIT_INSTANCE_LOCATOR,
        tokenProvider: new Chatkit.TokenProvider({
          url: process.env.REACT_APP_CHATKIT_TOKEN_PROVIDER_URL,
        }),
        userId: `user-${Date.now()}`,
      });

      setChatkitInstance(chatkit);

      // Join or create a room for this session
      let room;
      try {
        // Try to find existing room for this session
        const rooms = chatkit.rooms;
        room = rooms.find(r => r.name === sessionId) || null;
      } catch (error) {
        console.log('No existing room found, creating new one');
      }

      if (!room) {
        // Create a new room for this session
        room = await chatkit.createRoom({
          name: sessionId,
          addUserIds: [chatkit.userId],
        });
      }

      // Update the session with the room ID
      const updatedSession = { ...currentSession, roomId: room.id };
      setSession(updatedSession);

      // Subscribe to the room to receive messages
      await chatkit.subscribeToRoom({
        roomId: room.id,
        hooks: {
          onMessage: (message) => {
            const chatMessage = createNewMessage(
              message.id,
              message.senderId === chatkit.userId ? 'USER' : 'SYSTEM',
              message.text,
              sessionId
            );
            addMessage(chatMessage);
          }
        }
      });
    } catch (error) {
      console.error('Error initializing Chatkit:', error);
      // Fallback to API service
      console.warn('Using fallback API service due to Chatkit initialization error');
    } finally {
      setLoading(false);
    }
  };

  // Track the current page for context
  useEffect(() => {
    if (isOpen && currentSession) {
      // Update the session with the current page when the chat opens
      updateSessionPage(window.location.pathname);
    }
  }, [isOpen, currentSession, updateSessionPage]);

  // Update session page when URL changes
  useEffect(() => {
    const handleLocationChange = () => {
      if (currentSession) {
        updateSessionPage(window.location.pathname);
      }
    };

    // Listen for URL changes (for SPA navigation)
    window.addEventListener('popstate', handleLocationChange);

    // Also listen for custom events that might indicate route changes
    window.addEventListener('locationchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('locationchange', handleLocationChange);
    };
  }, [currentSession, updateSessionPage]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = document.querySelector('.chatbot-input');
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 100) + 'px';
    }
  }, [inputValue]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');

    try {
      setLoading(true);

      // Use Chatkit if available, otherwise fallback to API service
      if (chatkitInstance && currentSession) {
        // Send message via Chatkit
        await chatkitInstance.sendMessage({
          text: userMessage,
          roomId: currentSession.roomId, // This would need to be stored in the session
        });
      } else {
        // Create and add user message to UI immediately
        const userMsg = createNewInput(
          `msg-${Date.now()}`,
          userMessage,
          window.location.pathname
        );

        // Add user message to the chat
        const userChatMessage = createNewMessage(
          userMsg.id,
          'USER',
          userMsg.content,
          currentSession?.sessionId || 'default-session'
        );
        addMessage(userChatMessage);

        // Get page context to enhance the query
        const pageContext = chatbotApiService.getCurrentPageContext();

        // Get enhanced context from API
        let enhancedContext = {};
        try {
          enhancedContext = await chatbotApiService.getContext(window.location.pathname);
        } catch (contextError) {
          console.warn('Could not fetch enhanced context:', contextError);
          // Continue with the page context we have
        }

        // Get response from API with context
        const response = await chatbotApiService.sendMessage(
          currentSession?.sessionId || 'default-session',
          userMessage,
          window.location.pathname
        );

        // Add bot response to the chat
        const botMsg = createNewResponse(
          `resp-${Date.now()}`,
          response.response,
          userMessage
        );

        const botChatMessage = createNewMessage(
          botMsg.id,
          'SYSTEM',
          botMsg.content,
          currentSession?.sessionId || 'default-session'
        );
        addMessage(botChatMessage);
      }
    } catch (error) {
      console.error('Error sending message:', error);

      // Add error message to the chat
      const errorChatMessage = createNewMessage(
        `error-${Date.now()}`,
        'SYSTEM',
        'Sorry, I encountered an error. Please try again.',
        currentSession?.sessionId || 'default-session'
      );
      addMessage(errorChatMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="chatbot-container">
      {isOpen ? (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>Chat with us</h3>
            <button className="chatbot-close" onClick={toggleChatbot} aria-label="Close chat">
              ×
            </button>
          </div>
          <div className="chatbot-body">
            {isLoading ? (
              <div className="chatbot-loading">Loading...</div>
            ) : (
              <div className="chatbot-messages">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`message ${message.sender.toLowerCase()}`}
                    aria-label={`${message.sender} says: ${message.content}`}
                  >
                    {message.content}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="chatbot-footer">
            <form onSubmit={handleSubmit} className="chatbot-input-form">
              <textarea
                className="chatbot-input"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                rows="1"
                aria-label="Type your message"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="chatbot-send"
                disabled={isLoading || !inputValue.trim()}
                aria-label="Send message"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      ) : null}

      <button
        className="chatbot-toggle"
        onClick={toggleChatbot}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        💬
      </button>
    </div>
  );
};

export default Chatbot;