const fs = require('fs');
let src = fs.readFileSync('src/data/mockData.ts', 'utf8');

// 1. Remove all 'lab: ...' lines from labs arrays
src = src.replace(/,?\s*lab:\s*'[^']*'/g, '');

// 2. Convert string operations like ['Аппендэктомия (2005)'] to object arrays
src = src.replace(/operations:\s*\[\s*'([^'(]+)\s*\((\d{4})\)'\s*\]/g, function(match, name, year) {
  return "operations: [{ name: '" + name.trim() + "', date: '" + year + "-01-01', diagnosis: '\u2014', description: '\u041f\u043e\u0434\u0440\u043e\u0431\u043d\u043e\u0441\u0442\u0438 \u043d\u0435 \u0443\u043a\u0430\u0437\u0430\u043d\u044b', complications: '\u041d\u0435\u0442', implants: '\u041d\u0435\u0442', result: '\u0412\u044b\u0437\u0434\u043e\u0440\u043e\u0432\u043b\u0435\u043d\u0438\u0435' }]";
});

// 3. Convert string medicalProblems to objects
src = src.replace(/medicalProblems:\s*\[([^\]]*)\]/g, function(match, items) {
  if (items.trim() === '') return 'medicalProblems: []';
  if (items.includes('{')) return match; // already objects
  var strings = [];
  var re = /'([^']+)'/g;
  var m;
  while ((m = re.exec(items)) !== null) {
    strings.push(m[1]);
  }
  if (strings.length === 0) return match;
  var objects = strings.map(function(name) {
    return "{ name: '" + name + "', diagnosisDate: '', diseaseStatus: '\u0425\u0440\u043e\u043d\u0438\u0447\u0435\u0441\u043a\u043e\u0435', severity: '\u0423\u043c\u0435\u0440\u0435\u043d\u043d\u0430\u044f', description: '', complications: '\u041d\u0435\u0442' }";
  });
  return 'medicalProblems: [' + objects.join(', ') + ']';
});

// 4. Change all departments to Пульмонология
src = src.replace(/department:\s*'[^']+'/g, "department: '\u041f\u0443\u043b\u044c\u043c\u043e\u043d\u043e\u043b\u043e\u0433\u0438\u044f'");

// 5. Add phoneMobile to contacts that only have phone
src = src.replace(/(contacts:\s*\{\s*\n(\s*))phone:\s*('(?:[^']+)')/g, function(match, prefix, indent, phoneVal) {
  return prefix + 'phoneMobile: ' + phoneVal + ',\n' + indent + 'phoneHome: \'\',\n' + indent + 'phone: ' + phoneVal;
});

// 6. Add reason to labs doctor lines that don't have it
src = src.replace(/doctor:\s*'([^']+)'\s*\n(\s*)\}/g, function(match, doctor, indent) {
  return "doctor: '" + doctor + "',\n" + indent + "reason: '\u041f\u043b\u0430\u043d\u043e\u0432\u043e\u0435 \u043e\u0431\u0441\u043b\u0435\u0434\u043e\u0432\u0430\u043d\u0438\u0435'\n" + indent + "}";
});

fs.writeFileSync('src/data/mockData.ts', src, 'utf8');
console.log('Done! File size:', fs.statSync('src/data/mockData.ts').size, 'bytes');
