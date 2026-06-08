const fs = require('fs');
const filePath = 'app/lib/api.Client.ts';
let content = fs.readFileSync(filePath, 'utf-8');

// Update the function signature to accept null
const oldSig = 'async assignUserteam(userId: string, teamId: string) {';
const newSig = 'async assignUserteam(userId: string, teamId: string | null) {';

content = content.replace(oldSig, newSig);
fs.writeFileSync(filePath, content, 'utf-8');
console.log('✓ Updated API client to accept null teamId');
