
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

const filePath = '/Users/jenkim/Downloads/2026_Antigravity/fis-korea-dashboard/public/data/athletes/163744.xlsx'; // Lee Sangho

console.log(`Reading file: ${filePath}`);
const buf = fs.readFileSync(filePath);
const workbook = XLSX.read(buf, { type: 'buffer' });

// Check Info Sheet
const infoSheet = workbook.Sheets['선수정보'];
const infoData = XLSX.utils.sheet_to_json(infoSheet, { header: 1 }) as string[][];

console.log('--- Info Headers Found ---');
infoData.forEach(row => {
      if (row[0]) console.log(`Key: "${row[0]}" -> Value: "${row[1]}"`);
});

const getValue = (key: string): string => {
      const row = infoData.find(r => r[0] && r[0].toString().trim() === key);
      return row ? (row[1] || '') : 'NOT FOUND';
};

console.log(`\nSearching for "이름": ${getValue('이름')}`);
console.log(`Searching for "성별": ${getValue('성별')}`);

// Check Results Sheet
const resultsSheet = workbook.Sheets['경기결과'];
const resultsData = XLSX.utils.sheet_to_json(resultsSheet) as any[];

console.log('\n--- First Result Row Keys ---');
if (resultsData.length > 0) {
      console.log(Object.keys(resultsData[0]));
      console.log('Sample Row:', resultsData[0]);
} else {
      console.log('No results found');
}
