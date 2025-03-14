/**
 * State Adapter for Express Server
 * 
 * This file provides a JavaScript adapter for the TypeScript State class
 * to work with the Express server.
 */

// Simple State class implementation for the server
class State {
  constructor(userId = null, sessionId = null) {
    this.userId = userId || `user_${Date.now()}`;
    this.sessionId = sessionId || `session_${Date.now()}`;
    this.conversationHistory = [];
    this.preferences = {};
    this.unresolvedIntents = [];
    this.followUpCounts = {};
    this.promoCode = null;
  }

  addUserMessage(message) {
    this.conversationHistory.push({ role: 'user', content: message });
    return this;
  }

  addAssistantMessage(message) {
    this.conversationHistory.push({ role: 'assistant', content: message });
    return this;
  }

  getConversationHistory() {
    return this.conversationHistory;
  }

  setPreference(key, value) {
    this.preferences[key] = value;
    return this;
  }

  getPreference(key) {
    return this.preferences[key];
  }

  addUnresolvedIntents(intent) {
    if (!this.unresolvedIntents.includes(intent)) {
      this.unresolvedIntents.push(intent);
    }
    return this;
  }

  resolveIntent(intent) {
    this.unresolvedIntents = this.unresolvedIntents.filter(i => i !== intent);
    return this;
  }

  getUnresolvedIntents() {
    return this.unresolvedIntents;
  }

  incrementFollowUpCount(intent) {
    this.followUpCounts[intent] = (this.followUpCounts[intent] || 0) + 1;
    return this;
  }

  getFollowUpCount(intent) {
    return this.followUpCounts[intent] || 0;
  }

  updatePromoCode(promoCode) {
    this.promoCode = promoCode;
    return this;
  }

  clearPromoCode() {
    this.promoCode = null;
    return this;
  }
}

// Export the State class
module.exports = { State }; 