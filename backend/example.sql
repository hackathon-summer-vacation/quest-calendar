DROP TABLE IF EXISTS habit;
DROP TABLE IF EXISTS pages;
DROP TABLE IF EXISTS research_task;
DROP TABLE IF EXISTS research;
DROP TABLE IF EXISTS homework;
DROP TABLE IF EXISTS user;

-- ユーザーテーブル
CREATE TABLE user (
  user_id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  level INTEGER DEFAULT 1,
  enemies_defeated INTEGER DEFAULT 0,
  bosses_defeated INTEGER DEFAULT 0,
  days_until_deadline INTEGER DEFAULT 0
);

-- 宿題本体テーブル
CREATE TABLE homework (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  deadline DATE,
  days INTEGER NOT NULL,
  description TEXT NOT NULL,
  type INTEGER, -- 0: habit, 1: pages, 2: research
  is_done BOOLEAN DEFAULT 0,
  FOREIGN KEY(user_id) REFERENCES user(user_id)
);

-- 習慣系宿題
CREATE TABLE habit (
  homework_id INTEGER PRIMARY KEY,
  frequency INTEGER NOT NULL, -- 1=毎日, 2=毎週 など
  user_id INTEGER NOT NULL,
  FOREIGN KEY(homework_id) REFERENCES homework(id),
  FOREIGN KEY(user_id) REFERENCES user(user_id)
);

-- ページ系宿題
CREATE TABLE pages (
  homework_id INTEGER PRIMARY KEY,
  total_pages INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  FOREIGN KEY(homework_id) REFERENCES homework(id),
  FOREIGN KEY(user_id) REFERENCES user(user_id)
);

-- 研究系宿題
CREATE TABLE research (
  homework_id INTEGER PRIMARY KEY,
  theme TEXT NOT NULL,
  user_id INTEGER NOT NULL,
  FOREIGN KEY(homework_id) REFERENCES homework(id),
  FOREIGN KEY(user_id) REFERENCES user(user_id)
);

-- 研究タスク分け
CREATE TABLE research_task (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  research_id INTEGER NOT NULL,
  task_number INTEGER NOT NULL,
  content TEXT NOT NULL,
  deadline DATE,
  is_done BOOLEAN DEFAULT 0,
  FOREIGN KEY(research_id) REFERENCES research(homework_id),
  FOREIGN KEY(user_id) REFERENCES user(user_id)
);

-- ユーザー初期データ
INSERT INTO user (username, password) VALUES ('miki', 'mimi');
INSERT INTO user (username, password) VALUES ('yuki', 'yuyu');

-- mikiの宿題と詳細
INSERT INTO homework (user_id, title, deadline, days, description, type)
VALUES (1, '自由研究', '2025-08-10', 30, 'AIと未来の仕事について調べる', 2);
INSERT INTO research (homework_id, theme, user_id)
VALUES (1, 'AIと未来の仕事', 1);
INSERT INTO research_task (research_id, task_number, content, deadline)
VALUES (1, 1, 'AIの歴史と基本を調べる', '2025-07-20'),
       (1, 2, 'AIと仕事の関係について情報を集める', '2025-07-25'),
       (1, 3, '未来におけるAIの役割を予想してまとめる', '2025-08-01'),
       (1, 4, '発表資料と結論を作成する', '2025-08-08');

INSERT INTO homework (user_id, title, deadline, days, description, type)
VALUES (1, '夏の友（ドリル）', '2025-07-31', 15, '30ページの夏休みドリル', 1);
INSERT INTO pages (homework_id, total_pages, user_id)
VALUES (2, 30, 1);

INSERT INTO homework (user_id, title, deadline, days, description, type)
VALUES (1, '毎日漢字練習', '2025-07-31', 20, '1日1ページ漢字を練習', 0);
INSERT INTO habit (homework_id, frequency, user_id)
VALUES (3, 1, 1);

-- yukiの宿題と詳細
INSERT INTO homework (user_id, title, deadline, days, description, type)
VALUES (2, '自由研究（気候変動）', '2025-08-15', 25, '気候変動について調査しまとめる', 2);
INSERT INTO research (homework_id, theme, user_id)
VALUES (4, '気候変動とその対策', 2);
INSERT INTO research_task (research_id, task_number, content, deadline)
VALUES (4, 1, '気候変動の原因を調べる', '2025-07-25'),
       (4, 2, '世界の対策事例を調査', '2025-07-30'),
       (4, 3, '日本でできることを考える', '2025-08-05'),
       (4, 4, 'まとめと発表準備', '2025-08-13');

INSERT INTO homework (user_id, title, deadline, days, description, type)
VALUES (2, '夏休みワーク（理科）', '2025-08-01', 20, '理科の夏休みワーク全20ページ', 1);
INSERT INTO pages (homework_id, total_pages, user_id)
VALUES (5, 20, 2);

INSERT INTO homework (user_id, title, deadline, days, description, type)
VALUES (2, '読書感想文のための毎日読書', '2025-07-31', 15, '毎日30分読書してメモを書く', 0);
INSERT INTO habit (homework_id, frequency, user_id)
VALUES (6, 1, 2);
