export class TextProcessors {
  extractFromHtml(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body?.textContent || doc.textContent || '';
  }

  cleanText(text: string): string {
    return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
  }

  async extractTextContent(file: File, extension: string): Promise<string> {
    const buffer = await file.arrayBuffer();
    let text = '';

    switch (extension) {
      case 'txt':
      case 'md':
        text = new TextDecoder().decode(buffer);
        break;
      case 'html':
        text = this.extractFromHtml(new TextDecoder().decode(buffer));
        break;
      default:
        throw new Error(`Unsupported file type: ${extension}`);
    }

    return this.cleanText(text);
  }
}