import React from 'react';
import OriginalLayout from '@theme-original/Layout';
import { ChatbotProvider } from '../components/Chatbot/ChatbotProvider';
import Chatbot from '../components/Chatbot/Chatbot';

export default function Layout(props) {
  return (
    <ChatbotProvider>
      <OriginalLayout {...props}>
        {props.children}
        <Chatbot />
      </OriginalLayout>
    </ChatbotProvider>
  );
}