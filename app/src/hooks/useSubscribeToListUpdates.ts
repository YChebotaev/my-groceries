import { useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useApiClient } from './useApiClient'

export const useSubscribeToListUpdates = (listId: number | string) => {
  const apiClient = useApiClient()
  const { mutate: subscribe } = useMutation({
    async mutationFn() {
      await apiClient.post(`/lists/${listId}/socket/subscribe`)
    }
  })
  const { mutate: unsubscribe } = useMutation({
    async mutationFn() {
      await apiClient.post(`/lists/${listId}/socket/unsubscribe`)
    }
  })

  useEffect(() => {
    subscribe()

    return () => {
      unsubscribe()
    }
  }, [subscribe, unsubscribe])
}
