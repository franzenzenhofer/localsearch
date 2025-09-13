export const PDF_TEST_DATA = {
  SIMPLE: new Uint8Array([37, 80, 68, 70]), // %PDF header
  COMPLEX: new Uint8Array([37, 80, 68, 70, 45, 49, 46, 52]),
  CORRUPTED: new Uint8Array([1, 2, 3, 4]),
};

export const PDF_EXPECTED_TEXT = {
  SIMPLE: "Simple PDF content",
  COMPLEX: "Complex PDF with multiple pages",
  CORRUPTED: "",
};

export const PDF_MOCK_RESPONSES = {
  SUCCESS: { text: "Extracted PDF text" },
  ERROR: { error: "Invalid PDF format" },
  EMPTY: { text: "" },
};
