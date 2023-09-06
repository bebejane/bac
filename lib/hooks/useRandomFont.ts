export default function useRandomFont() {

  let lastFont = null

  const randomFont = (): string => {

    const f = `Logo${Math.floor(Math.random() * 3) + 1}`
    if (f === lastFont)
      return randomFont()
    else {
      lastFont = f
      return f
    }
  }

  return randomFont
}

