const fs = require('fs');
const filePath = 'app/components/dashboard/AdminDashboard.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// Replace user.team with teams lookup
content = content.replace(
  /{user\.team && \(\s*<span className="text-xs text-slate-500">\s*{user\.team\.code}\s*<\/span>\s*\)}/,
  `{user.teamId && (
                        <span className="text-xs text-slate-500">
                          {teams.find((t) => t.id === user.teamId)?.code}
                        </span>
                      )}`
);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('✓ Fixed AdminDashboard.tsx');
