export const getRouteQuery = (route: string) => {
  const url = new URL(route, window.location.origin)
  const params = new URLSearchParams(url.search)
  const query: { [key: string]: string } = {}
  for (const [key, value] of params.entries()) {
    query[key] = value
  }
  return query
}
