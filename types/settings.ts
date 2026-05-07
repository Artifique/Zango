export interface AppSettings {
  id: string; // Assuming a unique ID for the settings entry in Supabase
  notifications_realtime: boolean;
  session_security: boolean;
  display_preferences: boolean;
  user_id: string; // Assuming settings are per user
}

export type SettingsKey = keyof Omit<AppSettings, 'id' | 'user_id'>;
