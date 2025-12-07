import React, { createContext, useContext, useReducer } from 'react';

// Data Structures based on data-model.md
// Chat Message entity
const createChatMessage = (id, sender, content, timestamp, conversationId, status = 'SENT') => ({
  id,
  sender, // 'USER' | 'SYSTEM'
  content,
  timestamp: timestamp || new Date().toISOString(),
  conversationId,
  status, // 'SENT' | 'DELIVERED' | 'READ' | 'ERROR'
});

// Conversation Session entity
const createConversationSession = (sessionId, userId = null, currentPage = '', roomId = null) => ({
  id: sessionId,
  userId,
  sessionId,
  roomId, // Add room ID for Chatkit
  createdAt: new Date().toISOString(),
  lastActiveAt: new Date().toISOString(),
  currentPage,
  status: 'ACTIVE', // 'ACTIVE' | 'INACTIVE' | 'ENDED'
  messages: [],
});

// User Input entity
const createUserInput = (id, content, currentPage, context = {}) => ({
  id,
  content,
  timestamp: new Date().toISOString(),
  currentPage,
  context,
  sessionId: null, // Will be set when associated with a session
});

// Chatbot Response entity
const createChatbotResponse = (id, content, originalQuery, source = 'documentation') => ({
  id,
  content,
  timestamp: new Date().toISOString(),
  originalQuery,
  confidence: 0.8, // Default confidence
  source, // 'documentation', 'general knowledge', etc.
  sessionId: null, // Will be set when associated with a session
});

// Define initial state for the chatbot
const initialState = {
  isOpen: false,
  messages: [],
  currentSession: null,
  isLoading: false,
  error: null,
};

// Define action types
const actionTypes = {
  TOGGLE_CHATBOT: 'TOGGLE_CHATBOT',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  ADD_MESSAGE: 'ADD_MESSAGE',
  SET_SESSION: 'SET_SESSION',
  CLEAR_MESSAGES: 'CLEAR_MESSAGES',
  UPDATE_MESSAGE_STATUS: 'UPDATE_MESSAGE_STATUS',
  UPDATE_SESSION_STATUS: 'UPDATE_SESSION_STATUS',
  UPDATE_SESSION_PAGE: 'UPDATE_SESSION_PAGE',
};

// Reducer function to handle state changes
const chatbotReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.TOGGLE_CHATBOT:
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    case actionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case actionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case actionTypes.ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case actionTypes.SET_SESSION:
      return {
        ...state,
        currentSession: action.payload,
      };
    case actionTypes.CLEAR_MESSAGES:
      return {
        ...state,
        messages: [],
      };
    case actionTypes.UPDATE_MESSAGE_STATUS:
      return {
        ...state,
        messages: state.messages.map(message =>
          message.id === action.payload.messageId
            ? { ...message, status: action.payload.status }
            : message
        ),
      };
    case actionTypes.UPDATE_SESSION_STATUS:
      return {
        ...state,
        currentSession: state.currentSession
          ? { ...state.currentSession, status: action.payload }
          : null,
      };
    case actionTypes.UPDATE_SESSION_PAGE:
      return {
        ...state,
        currentSession: state.currentSession
          ? { ...state.currentSession, currentPage: action.payload, lastActiveAt: new Date().toISOString() }
          : null,
      };
    default:
      return state;
  }
};

// Create context
const ChatbotContext = createContext();

// Provider component
export const ChatbotProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatbotReducer, initialState);

  // Toggle chatbot open/close
  const toggleChatbot = () => {
    dispatch({ type: actionTypes.TOGGLE_CHATBOT });
  };

  // Set loading state
  const setLoading = (isLoading) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: isLoading });
  };

  // Set error
  const setError = (error) => {
    dispatch({ type: actionTypes.SET_ERROR, payload: error });
  };

  // Add a message
  const addMessage = (message) => {
    dispatch({ type: actionTypes.ADD_MESSAGE, payload: message });
  };

  // Set current session
  const setSession = (session) => {
    dispatch({ type: actionTypes.SET_SESSION, payload: session });
  };

  // Clear messages
  const clearMessages = () => {
    dispatch({ type: actionTypes.CLEAR_MESSAGES });
  };

  // Update message status
  const updateMessageStatus = (messageId, status) => {
    dispatch({
      type: actionTypes.UPDATE_MESSAGE_STATUS,
      payload: { messageId, status }
    });
  };

  // Additional functions for data structure creation
  const createNewMessage = (id, sender, content, conversationId, status = 'SENT') => {
    return createChatMessage(id, sender, content, null, conversationId, status);
  };

  const createNewSession = (sessionId, userId = null, currentPage = '') => {
    return createConversationSession(sessionId, userId, currentPage);
  };

  const createNewInput = (id, content, currentPage, context = {}) => {
    return createUserInput(id, content, currentPage, context);
  };

  const createNewResponse = (id, content, originalQuery, source = 'documentation') => {
    return createChatbotResponse(id, content, originalQuery, source);
  };

  const updateSessionStatus = (status) => {
    dispatch({ type: actionTypes.UPDATE_SESSION_STATUS, payload: status });
  };

  const updateSessionPage = (currentPage) => {
    dispatch({ type: actionTypes.UPDATE_SESSION_PAGE, payload: currentPage });
  };

  return (
    <ChatbotContext.Provider
      value={{
        ...state,
        toggleChatbot,
        setLoading,
        setError,
        addMessage,
        setSession,
        clearMessages,
        updateMessageStatus,
        createNewMessage,
        createNewSession,
        createNewInput,
        createNewResponse,
        updateSessionStatus,
        updateSessionPage,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
};

// Custom hook to use the chatbot context
export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};