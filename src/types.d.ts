export interface GoogleOneTapResponse {
  clientId: string
  credential: string
  select_by: "user"
}

export interface GoogleOneTapCredential {
  aud: string
  azp: string
  email: string
  email_verified: boolean
  exp: number
  family_name: string
  given_name: string
  iat: number
  iss: string
  jti: string
  name: string
  nbf: number
  nonce: string
  picture: string
  sub: string
}

export interface FirebaseGroceriesList {
  pin: string
  name: string
  items: FirebaseGroceriesListItem[]
};

export interface FirebaseGroceriesListItem {
  id: string
  shortage: boolean
  displayName: string
}

export interface ListDetailsParams {
  listPin: string
}
