 function generateCode(subjectName) { 
    const code = subjectName.substring(0, 4) + Date.now();
    return code;
  }

module.exports = generateCode;