export const DOCX_TEST_DATA = {
  SIMPLE: Buffer.from([80, 75, 3, 4]), // Mock ZIP header
  WITH_IMAGES: Buffer.from([80, 75, 3, 4, 1, 2, 3]), 
  COMPLEX: Buffer.from([80, 75, 3, 4, 5, 6, 7, 8])
};

export const DOCX_EXPECTED_TEXT = {
  SIMPLE: 'Simple DOCX content',
  WITH_IMAGES: 'DOCX with images',
  COMPLEX: 'Complex DOCX structure'
};

export const DOCX_MOCK_RESPONSES = {
  SUCCESS: { text: 'Extracted text', warnings: [] },
  WITH_WARNINGS: { text: 'Text', warnings: [{ type: 'warning', message: 'Unsupported style' }] },
  ERROR: { error: 'Failed to extract' }
};