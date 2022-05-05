import { getActivePinia } from 'pinia'

export function usePiniaLocalStorage(key: string): void {
  const pinia = getActivePinia()

  if (pinia) {
    // apply local storage app state
    const existingAppState = localStorage.getItem(key)
    if (existingAppState) pinia.state.value = JSON.parse(existingAppState)

    watch(() => pinia.state.value, (newState) => {
      localStorage.setItem(key, JSON.stringify(newState))
    }, { deep: true })
  }
}
