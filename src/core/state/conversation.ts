import { ConversationEntry } from '@/types/types';

/**
 * Class for managing conversation history
 * Stores and retrieves conversation entries
 */
export class ConversationStore {
  private entries: ConversationEntry[] = [];
  private readonly MAX_ENTRIES = 50;

  addEntry(role: 'user' | 'system' | 'assistant', content: string) {
    this.entries.push({
      role,
      content,
    });

    // Trim if exceeds max length
    if (this.entries.length > this.MAX_ENTRIES) {
      this.entries = this.entries.slice(-this.MAX_ENTRIES);
    }
  }

  /**
   * Gets the most recent conversation entries
   * @param count The number of entries to retrieve (default is 5)
   * @returns Array of recent conversation entries
   */
  getRecent(count = 5): ConversationEntry[] {
    return this.entries.slice(-count);
  }

  /**
   * Gets all conversation entries
   * @returns Array of all conversation entries
   */
  getAll(): ConversationEntry[] {
    return [...this.entries];
  }

  /**
   * Clears the conversation history
   */
  clear() {
    this.entries = [];
  }
}