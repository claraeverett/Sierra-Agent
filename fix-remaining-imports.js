const fs = require('fs');
const path = require('path');

// Function to recursively get all TypeScript files
function getTypeScriptFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      getTypeScriptFiles(filePath, fileList);
    } else if (file.endsWith('.ts')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to fix specific import issues
function fixImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Create a new content with fixed imports
  let updatedContent = content;
  
  // Fix imports with @/core/state/state to @/state/state
  updatedContent = updatedContent.replace(
    /from\s+['"]@\/core\/state\/state['"]/g,
    'from \'@/state/state\''
  );
  
  // Fix imports with @/services/tools/toolExport to @/services/tools/toolsExport
  updatedContent = updatedContent.replace(
    /from\s+['"]@\/services\/tools\/toolExport['"]/g,
    'from \'@/services/tools/toolsExport\''
  );
  
  // Fix imports with system-prompts to systemPrompts
  updatedContent = updatedContent.replace(
    /from\s+['"]@\/prompts\/system-prompts['"]/g,
    'from \'@/prompts/systemPrompts\''
  );
  
  // Fix imports with openai-service to openaiService
  updatedContent = updatedContent.replace(
    /from\s+['"]@\/services\/ai\/openai-service['"]/g,
    'from \'@/services/ai/openaiService\''
  );
  
  // Fix imports with external-api-service to apiService
  updatedContent = updatedContent.replace(
    /from\s+['"]@\/services\/api\/external-api-service['"]/g,
    'from \'@/services/api/apiService\''
  );
  
  // Write the updated content back to the file
  if (content !== updatedContent) {
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`Fixed imports in ${filePath}`);
  }
}

// Main function
function main() {
  const srcDir = path.resolve(__dirname, 'src');
  const tsFiles = getTypeScriptFiles(srcDir);
  
  console.log(`Found ${tsFiles.length} TypeScript files`);
  
  tsFiles.forEach(file => {
    fixImports(file);
  });
  
  console.log('Import fixes complete!');
}

main(); 