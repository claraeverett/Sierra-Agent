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

// Function to update imports in a file
function updateImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const srcDir = path.resolve(__dirname, 'src');
  const fileDir = path.dirname(filePath);
  const relativeToSrc = path.relative(fileDir, srcDir);
  
  // Skip files that are not in the src directory
  if (!filePath.includes('/src/')) {
    return;
  }
  
  // Get the file's path relative to src
  const filePathFromSrc = path.relative(srcDir, filePath);
  const filePathDir = path.dirname(filePathFromSrc);
  
  // Create a new content with updated imports
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
  
  // Replace relative imports with @ imports
  // Handle single-level relative imports (e.g., './file' or '../file')
  updatedContent = updatedContent.replace(
    /from\s+['"](\.\.?\/)([^'"]+)['"]/g,
    (match, prefix, importPath) => {
      // Calculate the absolute path of the import
      const absoluteImportPath = path.resolve(fileDir, prefix + importPath);
      
      // Check if the import is within the src directory
      if (absoluteImportPath.includes('/src/')) {
        // Get the import path relative to src
        const importPathFromSrc = path.relative(srcDir, absoluteImportPath);
        return `from '@/${importPathFromSrc}'`;
      }
      
      // If not in src, keep the original import
      return match;
    }
  );
  
  // Handle multi-level relative imports (e.g., '../../file')
  updatedContent = updatedContent.replace(
    /from\s+['"]((?:\.\.\/){2,})([^'"]+)['"]/g,
    (match, prefix, importPath) => {
      // Calculate the absolute path of the import
      const absoluteImportPath = path.resolve(fileDir, prefix + importPath);
      
      // Check if the import is within the src directory
      if (absoluteImportPath.includes('/src/')) {
        // Get the import path relative to src
        const importPathFromSrc = path.relative(srcDir, absoluteImportPath);
        return `from '@/${importPathFromSrc}'`;
      }
      
      // If not in src, keep the original import
      return match;
    }
  );
  
  // Write the updated content back to the file
  if (content !== updatedContent) {
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`Updated imports in ${filePath}`);
  }
}

// Main function
function main() {
  const srcDir = path.resolve(__dirname, 'src');
  const tsFiles = getTypeScriptFiles(srcDir);
  
  console.log(`Found ${tsFiles.length} TypeScript files`);
  
  tsFiles.forEach(file => {
    updateImports(file);
  });
  
  console.log('Import update complete!');
}

main(); 