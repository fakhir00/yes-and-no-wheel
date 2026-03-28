// StorageManager.js — LocalStorage wrapper with per-wheel namespacing
export class StorageManager {
  constructor(namespace = 'ynw') {
    this.namespace = namespace;
  }

  _key(key) {
    return `${this.namespace}_${key}`;
  }

  get(key, defaultValue = null) {
    try {
      const val = localStorage.getItem(this._key(key));
      return val ? JSON.parse(val) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  set(key, value) {
    try {
      localStorage.setItem(this._key(key), JSON.stringify(value));
    } catch (e) {
      console.warn('LocalStorage write failed:', e);
    }
  }

  remove(key) {
    localStorage.removeItem(this._key(key));
  }

  addToHistory(wheelName, result) {
    const history = this.get('history', []);
    history.unshift({
      wheel: wheelName,
      result: result,
      timestamp: new Date().toISOString()
    });
    // Keep last 100
    if (history.length > 100) history.pop();
    this.set('history', history);
  }

  getHistory() {
    return this.get('history', []);
  }

  clearHistory() {
    this.set('history', []);
  }

  getThemePreference() {
    return this.get('theme', 'dark');
  }

  setThemePreference(theme) {
    this.set('theme', theme);
  }
}

export const storage = new StorageManager();
