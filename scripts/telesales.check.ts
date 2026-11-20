// Run: npx tsx scripts/telesales.check.ts
import assert from 'node:assert';
import { parseTable, sheetToLeads, sheetCsvUrl } from '../src/data/telesales';

const csv = 'id,created_time,campaign_name,platform,full_name,phone_number,email,city,What age is your child?\r\n' +
  'l:1,2026-11-18T10:00:00+0530,Admissions Nov,fb,"Rao, Anita",p:+919876543210,a@x.com,Chennai,"2 ""and"" half"\r\n' +
  'l:2,,Admissions Nov,ig,Bad Phone,12345,,,\r\n' +
  'l:3,,Admissions Nov,ig,Ravi K,98765 11111,,Madurai,3\r\n';
const { leads, invalid } = sheetToLeads(parseTable(csv));
assert.equal(leads.length, 2); assert.equal(invalid, 1);
assert.equal(leads[0].name, 'Rao, Anita'); assert.equal(leads[0].phone, '9876543210'); assert.equal(leads[0].source, 'Facebook');
assert.equal(leads[0].message, 'What age is your child?: 2 "and" half');
assert.equal(leads[1].phone, '9876511111'); assert.equal(leads[1].source, 'Instagram');

// tab-separated paste from Google Sheets, first/last name columns
const tsv = 'first_name\tlast_name\tphone\nAsha\tM\t9000000001\n';
assert.equal(sheetToLeads(parseTable(tsv)).leads[0].name, 'Asha M');

assert.equal(sheetCsvUrl('https://docs.google.com/spreadsheets/d/abc_123/edit#gid=77'), 'https://docs.google.com/spreadsheets/d/abc_123/export?format=csv&gid=77');
assert.equal(sheetCsvUrl('https://evil.com/spreadsheets/d/abc/edit'), null);
assert.equal(sheetCsvUrl('http://docs.google.com/spreadsheets/d/abc/edit'), null);
console.log('telesales ok');
