const fs = require('fs');
const filePath = 'app/components/dashboard/AdminDashboard.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// Fix the import to use type-only imports
const oldImport = 'import { Role, Team, User } from "@prisma/client";';
const newImport = 'import type { Role, Team, User } from "@prisma/client";';

content = content.replace(oldImport, newImport);
fs.writeFileSync(filePath, content, 'utf-8');
console.log('✓ Fixed AdminDashboard imports to use type-only imports');
