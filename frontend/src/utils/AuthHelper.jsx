import { baseURL } from './FetchData'

export async function authHelper(path, email, mSetCurrentUser) {
  const res = await fetch(`${baseURL}${path}/${email}`, {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
  })

  const data = await res.json()
  mSetCurrentUser({ name: data.name, email: data.email, token: data.token })
  localStorage.setItem('token', data.token)
  localStorage.setItem('name', data.name)
  localStorage.setItem('email', data.email)
}
