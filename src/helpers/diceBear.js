export const avatarStyles = [
  "avataaars",
  "bottts",
  "fun-emoji",
  "pixel-art",
  "big-ears",
  "adventurer",
  "big-smile",
  "identicon",
  "notionists",
  "micah",
]

export function randomAvatarStlye() {
    return avatarStyles[Math.floor(Math.random() * avatarStyles.length)]
}

export function generateRandomSeed() {
  const minLength = 1 // minimum length of the code
  const maxLength = 10 // maximum length of the code
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" // possible characters in the code
  const length =
    Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength // random length between min and max length
  let result = ""
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}
