export const extractVideoId = (url) => {
  const match =
    url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/.*(?:\?|&)v=([^&]+)/) ||
    url.match(/(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?&]+)/)
  return match ? match[1] : null
}
