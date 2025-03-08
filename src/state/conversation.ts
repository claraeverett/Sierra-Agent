import { ConversationEntry } from '../types/types';

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

  getRecent(count = 5): ConversationEntry[] {
    return this.entries.slice(-count);
  }

  getAll(): ConversationEntry[] {
    return [...this.entries];
  }

  clear() {
    this.entries = [];
  }
}