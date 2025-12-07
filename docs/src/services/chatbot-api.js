// API service layer for chatbot communication based on contracts/chatbot-api.yaml

class ChatbotApiService {
  constructor(baseURL = '/api') {
    this.baseURL = baseURL;
  }

  /**
   * Start a new chat session
   * @param {string} currentPage - URL of the current documentation page
   * @param {string} [userId] - Optional user identifier
   * @returns {Promise<{sessionId: string, status: string}>}
   */
  async startSession(currentPage, userId = null) {
    try {
      const response = await fetch(`${this.baseURL}/chat/start-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPage,
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error starting chat session:', error);
      throw error;
    }
  }

  /**
   * Send a message to the chatbot
   * @param {string} sessionId - Current chat session identifier
   * @param {string} message - User's message content
   * @param {string} currentPage - URL of the current documentation page for context
   * @returns {Promise<{response: string, messageId: string, timestamp: string}>}
   */
  async sendMessage(sessionId, message, currentPage) {
    try {
      const response = await fetch(`${this.baseURL}/chat/send-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          message,
          currentPage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  /**
   * Get context for current page
   * @param {string} pageUrl - URL of the documentation page
   * @returns {Promise<{pageContext: object, pageUrl: string}>}
   */
  async getContext(pageUrl) {
    try {
      const response = await fetch(`${this.baseURL}/chat/get-context?pageUrl=${encodeURIComponent(pageUrl)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting context:', error);
      throw error;
    }
  }

  /**
   * Get current page context automatically
   * @returns {object} Context information for the current page
   */
  getCurrentPageContext() {
    return {
      url: window.location.pathname,
      title: document.title,
      // Extract key content from the page if possible
      content: this.extractPageContent(),
      keywords: this.extractPageKeywords(),
    };
  }

  /**
   * Extract relevant content from the current page
   * @returns {string} Relevant content from the page
   */
  extractPageContent() {
    // Try to extract main content from the page
    const mainContent = document.querySelector('main') || document.querySelector('.main') || document.querySelector('article');
    if (mainContent) {
      // Get text content and limit length
      const text = mainContent.textContent || mainContent.innerText;
      return text.substring(0, 1000); // Limit to first 1000 characters
    }
    return '';
  }

  /**
   * Extract keywords from the current page
   * @returns {string[]} Array of keywords from the page
   */
  extractPageKeywords() {
    // Extract keywords from various sources
    const keywords = [];

    // From meta tags
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      keywords.push(...metaKeywords.content.split(',').map(k => k.trim()));
    }

    // From headings
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(heading => {
      const text = heading.textContent.trim();
      if (text) keywords.push(text);
    });

    // From article tags or main content
    const mainContent = document.querySelector('main') || document.querySelector('.main') || document.querySelector('article');
    if (mainContent) {
      const paragraphs = mainContent.querySelectorAll('p');
      paragraphs.forEach(p => {
        const text = p.textContent.trim();
        // Extract potential keywords (first few words of each paragraph)
        const words = text.split(' ').slice(0, 5);
        keywords.push(...words.filter(word => word.length > 3)); // Only words longer than 3 chars
      });
    }

    // Remove duplicates and return
    return [...new Set(keywords)].filter(k => k.length > 0);
  }
}

// Create a singleton instance
const chatbotApiService = new ChatbotApiService();

export default chatbotApiService;