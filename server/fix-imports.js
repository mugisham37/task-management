const fs = require('fs');
const path = require('path');

// List of route files to fix
const routeFiles = [
  'activity.routes.ts',
  'analytics.routes.ts',
  'calendar.routes.ts',
  'comment.routes.ts',
  'dashboard.routes.ts',
  'export-import.routes.ts',
  'feedback.routes.ts',
  'health.routes.ts',
  'invitation.routes.ts',
  'notification.routes.ts',
  'project.routes.ts',
  'recurring-task.routes.ts',
  'task.routes.ts',
  'task-template.routes.ts',
  'team.routes.ts',
  'workspace.routes.ts'
];

const routesDir = path.join(__dirname, 'src', 'routes');

// Function to fix imports in a file
function fixImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace relative imports with path aliases
    content = content.replace(/from\s+['"]\.\./g, 'from "@');
    content = content.replace(/import\s+([^'"]*)\s+from\s+['"]\.\./g, 'import $1 from "@');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed imports in: ${path.basename(filePath)}`);
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

// Fix all route files
routeFiles.forEach(fileName => {
  const filePath = path.join(routesDir, fileName);
  if (fs.existsSync(filePath)) {
    fixImports(filePath);
  } else {
    console.log(`File not found: ${fileName}`);
  }
});

console.log('Import fixing completed!');
