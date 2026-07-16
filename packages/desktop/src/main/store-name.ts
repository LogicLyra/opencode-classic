export function requireStoreName(name: string) {
  if (!name || name === "." || name === ".." || !/^[a-zA-Z0-9._-]+$/.test(name)) {
    throw new Error("Invalid desktop store name")
  }
  return name
}
