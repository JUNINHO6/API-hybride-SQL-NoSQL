const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const commonPasswords = [
  '',
  'postgres',
  'admin',
  'root',
  'password',
  '123456',
  'postgresql',
  'PostgreSQL'
];

async function testConnection(password) {
  const pool = new Pool({
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || 5432,
    database: 'postgres',
    user: process.env.POSTGRES_USER || 'postgres',
    password: password,
    connectionTimeoutMillis: 2000,
  });

  try {
    const result = await pool.query('SELECT version()');
    await pool.end();
    return { success: true, password };
  } catch (error) {
    await pool.end();
    return { success: false, error: error.message };
  }
}

async function updateEnvFile(password) {
  const envPath = path.join(__dirname, '.env');
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  envContent = envContent.replace(
    /POSTGRES_PASSWORD=.*/,
    `POSTGRES_PASSWORD=${password}`
  );
  
  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log(`Fichier .env mis à jour avec le mot de passe trouvé`);
}

async function createDatabaseIfNotExists(password) {
  const pool = new Pool({
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || 5432,
    database: 'postgres',
    user: process.env.POSTGRES_USER || 'postgres',
    password: password,
  });

  try {
    const result = await pool.query(
      "SELECT 1 FROM pg_database WHERE datname = 'bookly_sql'"
    );

    if (result.rows.length === 0) {
      await pool.query('CREATE DATABASE bookly_sql');
      console.log('Base de données bookly_sql créée');
    } else {
      console.log('Base de données bookly_sql existe déjà');
    }
    await pool.end();
    return true;
  } catch (error) {
    console.error('Erreur lors de la création de la base:', error.message);
    await pool.end();
    return false;
  }
}

async function main() {
  console.log('Recherche du bon mot de passe PostgreSQL...\n');

  const currentPassword = process.env.POSTGRES_PASSWORD || 'postgres';
  console.log(`Tentative avec le mot de passe actuel: "${currentPassword}"`);
  
  let result = await testConnection(currentPassword);
  if (result.success) {
    console.log('Connexion réussie avec le mot de passe actuel !');
    await createDatabaseIfNotExists(currentPassword);
    console.log('\nConfiguration PostgreSQL validée !');
    return;
  }

  console.log('\nTest des mots de passe courants...\n');
  
  for (const password of commonPasswords) {
    const displayPassword = password === '' ? '(vide)' : password;
    console.log(`Tentative avec: "${displayPassword}"`);
    
    result = await testConnection(password);
    if (result.success) {
      console.log(`\nConnexion réussie avec le mot de passe: "${displayPassword}"`);
      
      await updateEnvFile(password);
      await createDatabaseIfNotExists(password);
      
      console.log('\nConfiguration PostgreSQL corrigée automatiquement !');
      console.log('Redémarrez le serveur pour appliquer les changements.');
      return;
    } else {
      console.log(`   Échec: ${result.error.split('\n')[0]}`);
    }
  }

  console.log('\nAucun mot de passe testé n\'a fonctionné.');
  console.log('\nSolutions manuelles:');
  console.log('1. Ouvrez pgAdmin et vérifiez/modifiez le mot de passe de l\'utilisateur postgres');
  console.log('2. Ou modifiez manuellement le fichier .env avec le bon mot de passe');
  console.log('3. Ou exécutez: psql -U postgres puis ALTER USER postgres PASSWORD \'votre_mot_de_passe\';');
}

main().catch(console.error);
