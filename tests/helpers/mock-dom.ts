import { vi } from 'vitest';

export const mockElement = {
  addEventListener: vi.fn(),
  style: {},
  innerHTML: '',
  textContent: '',
  classList: {
    add: vi.fn(),
    remove: vi.fn(),
    toggle: vi.fn(),
  },
  appendChild: vi.fn(),
  click: vi.fn(),
};

export const mockDocument = {
  getElementById: vi.fn(() => mockElement),
  createElement: vi.fn(() => mockElement),
  addEventListener: vi.fn(),
};

export const mockWindow = {
  showDirectoryPicker: vi.fn(),
  alert: vi.fn(),
  console: {
    log: vi.fn(),
    error: vi.fn(),
  },
};

export function setupMockDOM() {
  global.document = mockDocument as any;
  global.window = mockWindow as any;
  global.alert = mockWindow.alert;
  global.console = mockWindow.console as any;
}

export function clearMockDOM() {
  vi.clearAllMocks();
}

export const mockFileInput = {
  ...mockElement,
  files: [],
  value: '',
};

export function createMockFile(name: string, content: string, type = 'text/plain') {
  return new File([content], name, { type });
}

export function setupFileInput(files: File[]) {
  mockFileInput.files = files;
  return mockFileInput;
}