#!/usr/bin/env node
const { execSync } = require('child_process');
const oracledb = require('oracledb');

// Configuración de la conexión a la base de datos Oracle
const dbConfig = {
  user: 'DIP',
  password: 'luis12345',
  connectString: 'localhost:1521/XE',
};

function adjustToColombiaTimeZone(date) {
  const colombiaTimeZoneOffset = -5; // Colombia timezone offset in hours (GMT-5)
  return new Date(date.getTime() + colombiaTimeZoneOffset * 60 * 60 * 1000);
}

async function insertCommitToDb(commitId, author, date, log, repoUuid, commitPath, changedFiles) {
  const connection = await oracledb.getConnection(dbConfig);
  console.log('Insertando commit en la base de datos...');
  try {
    const commitDate = adjustToColombiaTimeZone(new Date(date)).toISOString();
    const sql = `INSERT INTO DIP.SVN_COMMITS (commit_id, author, commit_date, commit_message, repo_uuid, commit_path, changed_files) VALUES (:commit_id, :author, TO_TIMESTAMP(:commit_date, 'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"'), :commit_message, :repo_uuid, :commit_path, :changed_files)`;
    await connection.execute(sql, {
      commit_id: commitId,
      author,
      commit_date: commitDate,
      commit_message: log,
      repo_uuid: repoUuid,
      commit_path: commitPath,
      changed_files: changedFiles
    });
    await connection.commit();
    console.log('Commit insertado correctamente en la base de datos.');
  } catch (err) {
    console.error(`Error al insertar el commit en la base de datos: ${err.message}`);
  } finally {
    await connection.close();
  }
}

async function insertCommitsb(ver, sf, mess) {
  const connection = await oracledb.getConnection(dbConfig);
  console.log('Insertando commit en la base de datos...');
  try {
    
    const sql = `INSERT INTO DIP.VERSIONES (sfversion, version, message) VALUES (:sfversion, :version, :message)`;
    await connection.execute(sql, {
      version: ver,
      sfversion: sf,
      message: mess

      
    });
    await connection.commit();
    console.log('Commit insertado correctamente en la base de datos.');
  } catch (err) {
    console.error(`Error al insertar el commit en la base de datos: ${err.message}`);
  } finally {
    await connection.close();
  }
}

if (require.main === module) {
  const [_, __, repo, txn] = process.argv;
  console.log(`Obteniendo detalles del commit en el repositorio: ${repo}, transacción: ${txn}`);
  const commitId = execSync(`svnlook youngest ${repo}`).toString().trim();
  const author = execSync(`svnlook author -t ${txn} ${repo}`).toString().trim();
  const date = execSync(`svnlook date -t ${txn} ${repo}`).toString().trim();
  const log = execSync(`svnlook log -t ${txn} ${repo}`).toString().trim();
  const repoUuid = execSync(`svnlook uuid ${repo}`).toString().trim();
  const commitPath = execSync(`svnlook dirs-changed -t ${txn} ${repo}`).toString().trim();
  const changedFiles = execSync(`svnlook changed -t ${txn} ${repo}`).toString().trim();

  const logLines = log.split('\n');
  const values = {
    version: "",
    sf: "",
    message: ""
  };

  logLines.forEach(line => {
    const [field, value] = line.split(':').map(item => item.trim());
    if (field && value) {
      const normalizedField = field.toLowerCase();
      if (normalizedField in values) {
        values[normalizedField] = value;
      }
    }
  });

  if (!values.version || !values.sf || !values.message) {
    console.error('Mensaje de commit no válido. No se permite el commit.');
    process.exit(1);
  }
  
  insertCommitToDb(commitId, author, date, log, repoUuid, commitPath, changedFiles);
  insertCommitsb(values.version, values.sf, values.message);
}

