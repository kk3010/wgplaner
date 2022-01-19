import axios from 'axios'
import createAuthRefreshInterceptor from 'axios-auth-refresh'
import type { Ref } from 'vue'
import type { AxiosAuthRefreshRequestConfig } from 'axios-auth-refresh'
import type { IUser } from '@interfaces/user.interface'

const REFRESH_TOKEN = 'refresh-token'

export type TokenAuthResponse = { token: string; refresh_token?: string }
export type AuthResponse = TokenAuthResponse & { user: IUser }

export type RegisterRequest = Pick<IUser, 'email' | 'firstName' | 'lastName' | 'password'>

let accessToken: string | null = null
let axiosInterceptor: number | null = null

const getAccessToken = () => accessToken
// wrapper for access token to make axios always uses the new one
const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN)
const setRefreshToken = (value: string) => localStorage.setItem(REFRESH_TOKEN, value)

export function useAuth(user: Ref<IUser | undefined>) {
  const setTokens = (data: TokenAuthResponse) => {
    if (data.refresh_token) {
      setRefreshToken(data.refresh_token)
    }
    accessToken = data.token
  }

  const addTokenToAxios = () => {
    if (axiosInterceptor === null) {
      axiosInterceptor = axios.interceptors.request.use((req) => {
        if (req.headers) {
          req.headers['Authorization'] = `Bearer ${getAccessToken()}`
        }
        return req
      })
    }
  }

  const addRefreshHandler = () => {
    createAuthRefreshInterceptor(axios, () => refresh(), { statusCodes: [401, 422] })
  }

  const addAxiosAuth = () => {
    addTokenToAxios()
    addRefreshHandler()
  }

  const login = async (email: string, password: string) => {
    const { data } = await axios.post<AuthResponse>('/auth/login', { email, password }, {
      skipAuthRefresh: true,
    } as AxiosAuthRefreshRequestConfig)
    setTokens(data)
    user.value = data.user
  }

  const register = async (userToCreate: RegisterRequest) => {
    const { data } = await axios.post<AuthResponse>('/auth/register', userToCreate, {
      skipAuthRefresh: true,
    } as AxiosAuthRefreshRequestConfig)
    setTokens(data)
    user.value = data.user
  }

  const refresh = async () => {
    const { data } = await axios.post<TokenAuthResponse>('/auth/refresh', { refresh_token: getRefreshToken() }, {
      skipAuthRefresh: true,
    } as AxiosAuthRefreshRequestConfig)
    setTokens(data)
  }

  const logout = async () => {
    await axios.post<never>('/auth/logout')
    localStorage.removeItem(REFRESH_TOKEN)
    window.location.reload()
  }

  return { login, logout, register, addAxiosAuth, getAccessToken, refresh }
}
