CREATE TABLE user (
	"user_id"	INTEGER NOT NULL UNIQUE,
	"username"	CHAR(20) NOT NULL UNIQUE,
	"password"	CHAR(20) NOT NULL,
	PRIMARY KEY("user_id")
);

INSERT INTO user (username, password) VALUES ('miki', 'mimi');