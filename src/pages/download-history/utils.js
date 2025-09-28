export function getInitState () {
  const params = new URLSearchParams(location.search)
  const pageNo = Number(params.get('pageNo')) || 1
  const pageSize = Number(params.get('pageSize')) || 10

  return {
    pageNo,
    pageSize,
    apiKey: params.get('apiKey') ?? undefined
  }
}
