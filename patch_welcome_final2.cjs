const fs = require('fs');
let code = fs.readFileSync('src/pages/WelcomePage.tsx', 'utf-8');
code = code.replace(
  '// eslint-disable-next-line no-console\\n      console.error("Login error:", error);',
  'console.error("Login error:", error);'
);
fs.writeFileSync('src/pages/WelcomePage.tsx', code);
