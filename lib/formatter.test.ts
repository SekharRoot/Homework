import test from 'node:test';
import assert from 'node:assert/strict';
import {
  cleanBulletLines,
  formatDisplayDate,
  generateWhatsAppText,
  DEFAULT_SUBJECTS,
  DigestData,
} from './formatter';

test('cleanBulletLines handles various bullet formats and empty lines', () => {
  const input = `
  - First item
  * Second item
  • Third item with bullet
  -- Fourth item with dashes
  
  Plain text item without bullet
  `;
  const result = cleanBulletLines(input);
  assert.equal(result.length, 5);
  assert.equal(result[0], 'First item');
  assert.equal(result[1], 'Second item');
  assert.equal(result[2], 'Third item with bullet');
  assert.equal(result[3], '- Fourth item with dashes');
  assert.equal(result[4], 'Plain text item without bullet');
});

test('cleanBulletLines returns empty array for empty string', () => {
  assert.deepEqual(cleanBulletLines(''), []);
  assert.deepEqual(cleanBulletLines('   \n  \n  '), []);
});

test('formatDisplayDate formats valid ISO string to human date', () => {
  const formatted = formatDisplayDate('2026-10-27');
  assert.match(formatted, /Tuesday/);
  assert.match(formatted, /October 27, 2026/);
});

test('generateWhatsAppText produces WhatsApp-compatible markdown format with Homework title and without footer', () => {
  const testData: DigestData = {
    title: 'Homework',
    date: '2026-10-27',
    announcement: 'Bring project charts',
    subjects: [
      {
        ...DEFAULT_SUBJECTS[0],
        content: 'Solve Q1 to Q5\nRevise Chapter 3',
        enabled: true,
      },
      {
        ...DEFAULT_SUBJECTS[1],
        content: '',
        enabled: true,
      },
      {
        ...DEFAULT_SUBJECTS[2],
        content: 'Draw diagram of ear',
        enabled: true,
      },
    ],
  };

  const output = generateWhatsAppText(testData);

  assert.match(output, /📚 \*HOMEWORK\*/);
  assert.match(output, /📅 \*Date:\* Tuesday, October 27, 2026/);
  assert.match(output, /📢 \*Notice:\* Bring project charts/);
  assert.match(output, /⚛️ \*PHYSICS\*/);
  assert.match(output, /• Solve Q1 to Q5/);
  assert.match(output, /• Revise Chapter 3/);
  // Chemistry had empty content, shouldn't appear
  assert.equal(output.includes('*CHEMISTRY*'), false);
  // Biology has content
  assert.match(output, /🧬 \*BIOLOGY\*/);
  assert.match(output, /• Draw diagram of ear/);
  // No WhatsApp Digest or footer note
  assert.equal(output.toLowerCase().includes('whatsapp digest'), false);
  assert.equal(output.includes('parent diary'), false);
});
