export { cn } from "cn"

export const omit = <T>(record: Record<string, T>, key: string) => {
  const next = { ...record }
  delete next[key]
  return next
}
