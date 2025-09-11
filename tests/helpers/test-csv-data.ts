export const CSV_TEST_DATA = {
  BASIC: 'name,age,city\nJohn,30,NYC\nJane,25,LA',
  QUOTED: 'name,description\n"John Smith","Engineer at ABC"',
  NEWLINES: 'name,notes\nJohn,"Line 1\nLine 2"',
  SPECIAL_CHARS: 'name,data\n"Test, User","Data; with, special: chars"'
};

export const CSV_EXPECTED_RESULTS = {
  BASIC: [{ name: 'John', age: '30', city: 'NYC' }, { name: 'Jane', age: '25', city: 'LA' }],
  QUOTED: [{ name: 'John Smith', description: 'Engineer at ABC' }],
  NEWLINES: [{ name: 'John', notes: 'Line 1\nLine 2' }],
  SPECIAL_CHARS: [{ name: 'Test, User', data: 'Data; with, special: chars' }]
};