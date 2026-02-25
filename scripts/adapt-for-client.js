#!/usr/bin/env node

/**
 * Script de Adaptação para Novo Cliente
 * 
 * Este script ajuda a substituir strings comuns do projeto atual
 * pelas informações do novo cliente.
 * 
 * USO:
 *   node scripts/adapt-for-client.js
 * 
 * IMPORTANTE:
 * - Faça backup do projeto antes de rodar
 * - Revise manualmente após as substituições
 * - Teste tudo antes de fazer deploy
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Configurações de substituição
const replacements = {
  // Nome da empresa/sistema
  oldCompanyName: 'LASAC',
  oldSystemName: 'Mais Saúde',
  oldProductName: 'convênio',
  
  // Novos valores (serão solicitados)
  newCompanyName: '',
  newSystemName: '',
  newProductName: '',
};

// Arquivos e pastas a ignorar
const ignorePatterns = [
  'node_modules',
  '.git',
  'dist',
  'build',
  '.next',
  'logs',
  'scripts/adapt-for-client.js', // Não modificar a si mesmo
  'NOVO_CLIENTE_CHECKLIST.md',
  'FORMULARIO_NOVO_CLIENTE.md',
];

// Extensões de arquivo para processar
const processExtensions = [
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.json',
  '.md',
  '.txt',
];

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function shouldProcessFile(filePath) {
  // Verificar se está em pasta ignorada
  for (const pattern of ignorePatterns) {
    if (filePath.includes(pattern)) {
      return false;
    }
  }
  
  // Verificar extensão
  const ext = path.extname(filePath);
  return processExtensions.includes(ext);
}

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    
    if (fs.statSync(fullPath).isDirectory()) {
      // Verificar se deve ignorar esta pasta
      if (!ignorePatterns.some(pattern => fullPath.includes(pattern))) {
        arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
      }
    } else {
      if (shouldProcessFile(fullPath)) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Substituir nome da empresa
  if (content.includes(replacements.oldCompanyName)) {
    content = content.replace(
      new RegExp(replacements.oldCompanyName, 'g'),
      replacements.newCompanyName
    );
    modified = true;
  }
  
  // Substituir nome do sistema
  if (content.includes(replacements.oldSystemName)) {
    content = content.replace(
      new RegExp(replacements.oldSystemName, 'g'),
      replacements.newSystemName
    );
    modified = true;
  }
  
  // Substituir nome do produto (com cuidado para case-sensitive)
  if (content.includes(replacements.oldProductName)) {
    content = content.replace(
      new RegExp(replacements.oldProductName, 'g'),
      replacements.newProductName.toLowerCase()
    );
    modified = true;
  }
  
  // Variações com primeira letra maiúscula
  const oldProductCapitalized = replacements.oldProductName.charAt(0).toUpperCase() + 
                                replacements.oldProductName.slice(1);
  const newProductCapitalized = replacements.newProductName.charAt(0).toUpperCase() + 
                                replacements.newProductName.slice(1);
  
  if (content.includes(oldProductCapitalized)) {
    content = content.replace(
      new RegExp(oldProductCapitalized, 'g'),
      newProductCapitalized
    );
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  
  return false;
}

async function main() {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║   🔄 Script de Adaptação para Novo Cliente               ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');
  
  console.log('⚠️  IMPORTANTE:');
  console.log('   - Faça backup do projeto antes de continuar');
  console.log('   - Este script fará substituições em TODOS os arquivos');
  console.log('   - Revise manualmente após as substituições\n');
  
  const confirm = await question('Você fez backup e deseja continuar? (s/N): ');
  
  if (confirm.toLowerCase() !== 's') {
    console.log('\n❌ Operação cancelada.');
    rl.close();
    return;
  }
  
  console.log('\n📝 Por favor, informe os dados do novo cliente:\n');
  
  // Coletar informações
  replacements.newCompanyName = await question(
    `Nome da Empresa (atual: "${replacements.oldCompanyName}"): `
  );
  
  replacements.newSystemName = await question(
    `Nome do Sistema (atual: "${replacements.oldSystemName}"): `
  );
  
  replacements.newProductName = await question(
    `Nome do Produto (atual: "${replacements.oldProductName}"): `
  );
  
  // Validar inputs
  if (!replacements.newCompanyName || 
      !replacements.newSystemName || 
      !replacements.newProductName) {
    console.log('\n❌ Todos os campos são obrigatórios!');
    rl.close();
    return;
  }
  
  console.log('\n📋 Resumo das substituições:');
  console.log(`   "${replacements.oldCompanyName}" → "${replacements.newCompanyName}"`);
  console.log(`   "${replacements.oldSystemName}" → "${replacements.newSystemName}"`);
  console.log(`   "${replacements.oldProductName}" → "${replacements.newProductName}"\n`);
  
  const confirmReplace = await question('Confirma as substituições? (s/N): ');
  
  if (confirmReplace.toLowerCase() !== 's') {
    console.log('\n❌ Operação cancelada.');
    rl.close();
    return;
  }
  
  console.log('\n🔍 Buscando arquivos...');
  
  const projectRoot = path.resolve(__dirname, '..');
  const allFiles = getAllFiles(projectRoot);
  
  console.log(`   Encontrados ${allFiles.length} arquivos para processar\n`);
  console.log('🔄 Processando substituições...\n');
  
  let modifiedCount = 0;
  const modifiedFiles = [];
  
  allFiles.forEach(file => {
    try {
      if (replaceInFile(file, replacements)) {
        modifiedCount++;
        modifiedFiles.push(file.replace(projectRoot, ''));
        process.stdout.write(`✓ ${file.replace(projectRoot, '')}\n`);
      }
    } catch (error) {
      console.error(`❌ Erro ao processar ${file}: ${error.message}`);
    }
  });
  
  console.log(`\n✅ Substituições concluídas!`);
  console.log(`   ${modifiedCount} arquivos modificados\n`);
  
  if (modifiedFiles.length > 0) {
    console.log('📄 Arquivos modificados:');
    modifiedFiles.forEach(file => console.log(`   - ${file}`));
  }
  
  console.log('\n⚠️  PRÓXIMOS PASSOS:');
  console.log('   1. Revise manualmente os arquivos modificados');
  console.log('   2. Atualize templates do WhatsApp em src/lib/whatsapp/templates.ts');
  console.log('   3. Configure variáveis de ambiente (.env)');
  console.log('   4. Atualize logo e assets em /public');
  console.log('   5. Atualize cores em tailwind.config.ts');
  console.log('   6. Teste tudo em ambiente DEV antes de fazer deploy');
  console.log('\n📚 Consulte NOVO_CLIENTE_CHECKLIST.md para lista completa\n');
  
  // Salvar log de substituições
  const logPath = path.join(projectRoot, 'adaptation-log.txt');
  const logContent = `
Adaptação para Novo Cliente
Data: ${new Date().toISOString()}

Substituições:
- ${replacements.oldCompanyName} → ${replacements.newCompanyName}
- ${replacements.oldSystemName} → ${replacements.newSystemName}
- ${replacements.oldProductName} → ${replacements.newProductName}

Arquivos modificados (${modifiedCount}):
${modifiedFiles.map(f => `- ${f}`).join('\n')}
  `.trim();
  
  fs.writeFileSync(logPath, logContent, 'utf8');
  console.log(`📝 Log salvo em: adaptation-log.txt\n`);
  
  rl.close();
}

main().catch(error => {
  console.error('❌ Erro fatal:', error);
  rl.close();
  process.exit(1);
});



