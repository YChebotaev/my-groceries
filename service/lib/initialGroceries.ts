import { readFileSync } from 'node:fs'
import path from 'node:path'

const fileContent = readFileSync(
  path.join(__dirname, '../data/initialGroceries.txt'),
  'utf-8'
)

export const initialGroceries = fileContent
  .trim()
  .split('\n')
  .map(s => s.trim())
