import test from 'node:test';
import assert from 'node:assert/strict';
import { countryName } from '../src/utils/countryName.js';

const names = new Intl.DisplayNames(['tr-TR'], { type: 'region' });

test('countryName labels unknown and malformed country values without throwing', () => {
  assert.equal(countryName('Unknown', names, 'Bilinmeyen ülke'), 'Bilinmeyen ülke');
  assert.equal(countryName('XX', names, 'Bilinmeyen ülke'), 'Bilinmeyen ülke');
  assert.equal(countryName('T1', names, 'Bilinmeyen ülke'), 'Bilinmeyen ülke');
});

test('countryName resolves valid region codes', () => {
  assert.equal(countryName('TR', names, 'Bilinmeyen ülke'), 'Türkiye');
});
