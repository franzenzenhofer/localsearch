export function extractSVGText(svgContent: string): string {
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(svgContent, 'image/svg+xml')
    
    const textElements = doc.querySelectorAll('text, tspan, title, desc')
    const extractedText = Array.from(textElements)
      .map(el => el.textContent || '')
      .filter(text => text.trim().length > 0)
      .join(' ')
    
    return extractedText || 'No text found in SVG'
  } catch (error) {
    return 'SVG text extraction failed'
  }
}