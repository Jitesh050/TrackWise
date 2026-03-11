const fs = require('fs');

try {
  const fileContent = fs.readFileSync('src/pages/CollisionDetection.tsx', 'utf-8');
  console.log("File read successfully");
} catch (e) {
  console.error("Error reading file:", e);
}
