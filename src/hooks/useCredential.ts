import {GoogleOneTapCredential} from '../types.d'
import jwtDecode from "jwt-decode";
import { useMemo } from 'react'

export const useCredential = (): GoogleOneTapCredential|null => {
  return useMemo(() => {
    if (localStorage.getItem("credential")) {
      return jwtDecode(
        localStorage.getItem("credential") as string
      ) as GoogleOneTapCredential;
    } else {
      return null
    }
  }, [])
}
