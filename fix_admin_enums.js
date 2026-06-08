const fs = require('fs');
const filePath = 'app/components/dashboard/AdminDashboard.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// Fix the import to use the enums file instead of @prisma/client
const oldImport = 'import type { Role, Team, User } from "@prisma/client";';
const newImport = `import { Role } from "@/app/generated/prisma/enums";
import type { Team, User } from "@prisma/client";`;

content = content.replace(oldImport, newImport);
fs.writeFileSync(filePath, content, 'utf-8');
console.log('✓ Updated AdminDashboard to import Role from enums file');
