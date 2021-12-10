import axios from 'axios'
import createAuthRefreshInterceptor from 'axios-auth-refresh'
import type { AxiosAuthRefreshRequestConfig } from 'axios-auth-refresh'
import { IUser } from '@interfaces/user.interface'

const REFRESH_TOKEN = 'refresh-token'

type AuthResponse = { user: IUser; token: string; refresh_token?: string }

let accessToken: string | null = null
let axiosInterceptor: number | null = null

export function useAuth() {
  // wrapper for access token to make axios always uses the new one
  const getAccessToken = () => accessToken
  const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN)
  const setRefreshToken = (value: string) => localStorage.setItem(REFRESH_TOKEN, value)

  const setTokens = (data: AuthResponse) => {
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
  }

  const register = async (user: Pick<IUser, 'email' | 'firstName' | 'lastName' | 'password'>) => {
    const { data } = await axios.post<AuthResponse>('/auth/register', user, {
      skipAuthRefresh: true,
    } as AxiosAuthRefreshRequestConfig)
    setTokens(data)
  }

  const refresh = async () => {
    const { data } = await axios.post<AuthResponse>('/auth/refresh', { refresh_token: getRefreshToken() }, {
      skipAuthRefresh: true,
    } as AxiosAuthRefreshRequestConfig)
    setTokens(data)
  }

  const logout = async () => {
    localStorage.removeItem(REFRESH_TOKEN)
    if (axiosInterceptor) {
      axios.interceptors.request.eject(axiosInterceptor)
      axiosInterceptor = null
    }
  }

  return { login, logout, register, addAxiosAuth }
}