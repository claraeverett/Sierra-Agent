import { PreferenceKey } from '@/types/types';

/**
 * Class for managing customer preferences
 * Stores and retrieves user preferences for various features
 */
export class CustomerPreferences {
    private preferences: Record<string, string> = {
      hikingLocations: '',
      hikingDifficulty: '',
      hikingLength: '',
      hikingPlaylist: '',
    };
  
    /**
     * Gets a specific preference value
     * @param key The preference key to retrieve
     * @returns The preference value as a string
     */
    getPreference(key: PreferenceKey): string  {
      return this.preferences[key];
    }

    /**
     * Sets a specific preference value
     * @param key The preference key to set
     * @param value The value to set the preference to
     */
    setPreference(key: PreferenceKey, value: string) {
      this.preferences[key] = String(value);
      console.log(`Updated preference ${key} to ${value}`);
    }

    /**
     * Clears a specific preference value
     * @param key The preference key to clear
     */
    clearPreference(key: PreferenceKey) {
        this.preferences[key] = '';
    }

    /**
     * Clears all preferences
     */
    clearAllPreferences() {
        this.preferences = {
            hikingLocations: '',
            hikingDifficulty: '',
            hikingLength: '',
            hikingPlaylist: '',
        };
    }
  }