export function createStorage<T>(key: string, fallbackValue: T) {
  let memoryFallback: T | null = null

  function read(): T {
    try {
      const raw = localStorage.getItem(key)
      if (raw) return JSON.parse(raw) as T
      return fallbackValue
    } catch {
      if (memoryFallback !== null) return memoryFallback
      return fallbackValue
    }
  }

  function write(value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      memoryFallback = value
    }
  }

  return { read, write }
}
