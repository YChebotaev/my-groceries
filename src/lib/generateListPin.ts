import { LIST_PIN_LENGTH } from '../constants'

export const generateListPin = (): string => {
  const pin = []
  while (pin.length < LIST_PIN_LENGTH) {
    pin.push(Math.round(Math.random() * 10))
  }
  return pin.join('')
}
