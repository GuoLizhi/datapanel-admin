export function getInitState () {
  const params = new URLSearchParams(location.search)
  const pageNo = Number(params.get('pageNo')) || 1
  const pageSize = Number(params.get('pageSize')) || 10

  return {
    pageNo,
    pageSize,
    exchange: params.get('exchange') ?? undefined,
    dataType: params.get('dataType') ?? undefined,
    symbols: params.get('symbols')?.split('|')?.map((item) => Number(item)) ?? undefined
  }
}
