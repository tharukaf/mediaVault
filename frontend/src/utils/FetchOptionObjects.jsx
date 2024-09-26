export const createUserRequestOptions = data => ({
  method: 'POST',
  mode: 'cors',
  credentials: 'same-origin',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
})

export const loginRequestOptions = data => ({
  method: 'POST',
  mode: 'cors',
  credentials: 'same-origin',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
})
