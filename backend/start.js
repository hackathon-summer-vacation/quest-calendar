const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// データベースファイルのパス
const dbPath = path.join(__dirname, 'example.db');
const db = new Database(dbPath);

// example.sql のパス
const sqlFilePath = path.join(__dirname, 'example.sql');

// SQLファイルを読み込む
try {
  const sql = fs.readFileSync(sqlFilePath, 'utf8');

  // SQLを実行
  db.exec(sql);

  console.log('✅ example.sql has been applied to the database.');
} catch (err) {
  console.error('❌ Failed to apply example.sql:', err);
} finally {
  db.close();
}
