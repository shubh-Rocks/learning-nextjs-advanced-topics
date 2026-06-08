const fs = require('fs');
const path = require('path');

const filePath = 'app/components/dashboard/AdminDashboard.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// Replace the problematic user.team reference with teams array lookup
const oldCode = `{user.team && (
                          <span className="text-xs text-slate-500">
                            {user.team.code}
                          </span>
                        )}`;

const newCode = `{user.teamId && (
                          <span className="text-xs text-slate-500">
                            {teams.find((t) => t.id === user.teamId)?.code}
                          </span>
                        )}`;

if (content.includes(oldCode)) {
  content = content.replace(oldCode, newCode);
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('✓ Fixed user.team reference in AdminDashboard.tsx');
} else {
  console.log('Code pattern not found - checking variations...');
}
