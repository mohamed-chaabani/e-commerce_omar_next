const generateRandomId = (length) => {
  let id = ''
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    id += characters[randomIndex]
  }

  return id
}

export default generateRandomId
