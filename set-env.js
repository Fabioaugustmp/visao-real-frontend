// set-env.js
const fs = require('fs');
const path = require('path');

// Carrega as variáveis do .env para process.env, mas as variáveis de ambiente do sistema terão precedência.
require('dotenv').config();

const targetPath = path.join(__dirname, './src/environments/environment.production.ts');

// Usa a variável de ambiente do sistema se disponível, caso contrário, usa a do .env
const apiUrl = process.env.API_URL;

if (!apiUrl) {
  console.error('Erro: A variável de ambiente API_URL não está definida. Crie um arquivo .env ou defina a variável de ambiente do sistema.');
  process.exit(1);
}

// Conteúdo do arquivo de ambiente de produção
const envConfigFile = `export const environment = {
  production: true,
  apiUrl: '${apiUrl}'
};
`;

fs.writeFile(targetPath, envConfigFile, (err) => {
  if (err) {
    console.error(err);
    throw err;
  } else {
    console.log(`Arquivo de ambiente de produção gerado com sucesso em ${targetPath}`);
  }
});