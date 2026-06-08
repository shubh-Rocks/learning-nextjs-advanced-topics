const fs = require('fs');

const files = [
  'app/components/dashboard/MangerDashboard.tsx',
  'app/components/dashboard/UserDashboard.tsx',
  'app/components/layout/Header.tsx'
];

files.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const oldImport = 'import { User } from "@prisma/client";';
    const newImport = 'import type { User } from "@prisma/client";';
    
    if (content.includes(oldImport)) {
      content = content.replace(oldImport, newImport);
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`✓ Fixed ${filePath}`);
    }
  } catch (error) {
    console.log(`⚠ Could not fix ${filePath}: ${error.message}`);
  }
});
