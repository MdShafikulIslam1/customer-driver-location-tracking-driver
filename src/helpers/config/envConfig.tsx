const getBaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
  return url
}

export default getBaseUrl
