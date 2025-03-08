export enum PreferenceKey {
    location = 'hikingLocations',
    length = 'hikingLength',
    playlist = 'hikingPlaylist',
    difficulty = 'hikingDifficulty',
  }

export class CustomerPreferences {
    private preferences: Record<string, string> = {
      hikingLocations: '',
      hikingDifficulty: '',
      hikingLength: '',
      hikingPlaylist: '',
    };
  
    getPreference(key: PreferenceKey): string  {
      return this.preferences[key];
    }
  
    setPreference(key: PreferenceKey, value: string) {
      this.preferences[key] = String(value);
      console.log(`Updated preference ${key} to ${value}`);
    }
  
    clearPreference(key: PreferenceKey) {
        this.preferences[key] = '';
    }

    clearAllPreferences() {
        this.preferences = {
            hikingLocations: '',
            hikingDifficulty: '',
            hikingLength: '',
            hikingPlaylist: '',
        };
    }
  }