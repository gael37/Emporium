import { Buffer } from 'buffer'

const tokenName = 'bargain-project-token'

export const setToken = (token) => {
  localStorage.setItem(tokenName, token)
}

export const getToken = () => {
  return localStorage.getItem(tokenName)
}

// This function will decode the token saved in our local storage and return the payload
export const getPayload = () => {
  const token = getToken()
  // Check the token has a value - will return null if no token exists
  // In the case that no token exists, we return false as the function value
  if (!token) return false
  // If there is a token, we want to check it's the correct format
  // If there are 3 sections, separated by a . we are happy to proceed
  const splitToken = token.split('.')
  if (splitToken.length !== 3) return false
  // Get the payload from the token
  // Decoding the base64 encoded string, and returning the payload object that was the second part of the JWT
  return JSON.parse(Buffer.from(splitToken[1], 'base64'))
}

// This function will check for a token, and then check that token has not expired
export const isAuthenticated = () => {
  const payload = getPayload()
  if (!payload) return false
  // Check the expiry from the token is in the future
  const { exp } = payload
  const now = Math.round(Date.now() / 1000)
  return exp > now
}

export const handleLogout = (navigate) => {
  // Remove the token from localStorage
  localStorage.removeItem(tokenName)
  // Navigate to the login page
  navigate('/login')
}

// This function will check one id against another
export const isOwner = (token1) => {
  const payload = getPayload()
  if (!payload) return false
  return token1 === payload.sub
}