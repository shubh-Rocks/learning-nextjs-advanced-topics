const fs = require('fs');
const filePath = 'app/components/dashboard/AdminDashboard.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// Fix the team assignment handler to pass null instead of ""
const oldLine = 'await apiClient.assignUserteam(userId, teamId ?? "");';
const newLine = 'await apiClient.assignUserteam(userId, teamId || null);';

content = content.replace(oldLine, newLine);
fs.writeFileSync(filePath, content, 'utf-8');
console.log('✓ Fixed AdminDashboard team assignment to pass null instead of empty string');
