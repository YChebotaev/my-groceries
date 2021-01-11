import { FirebaseGroceriesList } from '../types.d'

export const generateList = (pin: string, name: string): FirebaseGroceriesList => {
  return {
    pin,
    name,
    items: [
      {
        id: '78d045f1-eb66-4b80-adc3-8e46481cb557',
        shortage: false,
        displayName: 'Хлеб'
      },
      {
        id: '5ca8c347-fa58-426d-889c-e39541e05d72',
        shortage: false,
        displayName: 'Молоко'
      },
      {
        id: '0734d1f6-e59e-45de-935d-459a4884fc6c',
        shortage: false,
        displayName: 'Яйца'
      },
      {
        id: 'ec0acf4a-a8df-41e7-bd4a-b78ba742c90c',
        shortage: false,
        displayName: 'Сахар'
      },
      {
        id: 'e6a29790-d285-4202-9c3b-4f418d1479e1',
        shortage: false,
        displayName: 'Соль'
      }
    ]
  }
}
