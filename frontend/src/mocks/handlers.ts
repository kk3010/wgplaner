import { rest } from 'msw'

interface User {
  firstName: string
  lastName: string
  password: string
  email: string
}

export const handlers = [
  // Handlers a POST /login request
  rest.post('/auth/login', (req, res, ctx) => {
    sessionStorage.setItem('is-authenticated', 'true')

    return res(ctx.status(200))
  }),
  rest.post<User>('/auth/register', (req, res, ctx) => {
    const user = req.body
    const sessionItem = sessionStorage.getItem('users')
    const users: User[] = sessionItem ? JSON.parse(sessionItem) : []
    users.push(user)
    sessionStorage.setItem('users', JSON.stringify(users))

    return res(ctx.status(201))
  }),
  rest.get('/user', (req, res, ctx) => {
    // Check if the user is authenticated in this session
    const isAuthenticated = sessionStorage.getItem('is-authenticated')

    if (!isAuthenticated) {
      // If not authenticated, respond with a 403 error
      return res(
        ctx.status(403),
        ctx.json({
          errorMessage: 'Not authorized',
        }),
      )
    }

    // If authenticated, return mocked user details
    return res(
      ctx.status(200),
      ctx.json({
        username: 'admin',
        password: 'admin',
      }),
    )
  }),
]
