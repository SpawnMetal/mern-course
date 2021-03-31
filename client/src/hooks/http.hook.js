// Модуль позволяет в комфортном режиме работать с асинхронными запросами на сервер, используя нативный API браузера Fetch, только в формате хуков

import {useState, useCallback} from 'react'

export const useHttp = () => {
  // Будем определять, грузится ли что-нибудь с сервера или нет
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const request = useCallback(
    async (url, method = 'GET', body = null, headers = {}) => {
      setLoading(true)
      try {
        if (body) {
          // Корректная передача параметров body в JSON
          body = JSON.stringify(body) // Network - Headers - Request Payload получит корректные данные - строку JSON
          headers['Content-Type'] = 'application/json' // Объясняем серверу, что передаётся JSON
        }

        const response = await fetch(url, {
          method,
          body,
          headers,
        })
        const data = await response.json()

        if (!response.ok) throw new Error(data.message || 'Что-то пошло не так')

        setLoading(false)

        return data
      } catch (e) {
        setLoading(false)
        setError(e.message)
        throw e // Для обработки в компонентах
      }
    },
    []
  )

  const clearError = useCallback(() => setError(null), [])

  return {loading, request, error, clearError}
}
