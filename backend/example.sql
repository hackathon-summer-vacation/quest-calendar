DROP TABLE IF EXISTS user;
CREATE TABLE user (
  user_id INTEGER NOT NULL UNIQUE,
  username CHAR(20) NOT NULL UNIQUE,
  password CHAR(20) NOT NULL,
  level INTEGER DEFAULT 1,
  enemies_defeated INTEGER DEFAULT 0,
  bosses_defeated INTEGER DEFAULT 0,
  days_until_deadline INTEGER DEFAULT 0,
  PRIMARY KEY(user_id)
);

INSERT INTO user (username, password) VALUES ('miki', 'mimi');

-- profile.jsxで必要な情報を取得するためのSQLクエリの例
-- 実際のアプリケーションでは、?の部分にユーザーIDを指定します。
SELECT
  username,
  level,
  enemies_defeated,
  bosses_defeated,
  days_until_deadline
FROM
  user
WHERE
  user_id = ?;
