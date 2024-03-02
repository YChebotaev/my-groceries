export const asNumberGuard = (numStr: string | undefined) => {
  if (numStr == null) {
    throw new Error('Not a number')
  }

  const num = Number(numStr)

  if (Number.isNaN(num)) {
    throw new Error(`Can\'t parse number: ${numStr}`)
  }

  return num
}
