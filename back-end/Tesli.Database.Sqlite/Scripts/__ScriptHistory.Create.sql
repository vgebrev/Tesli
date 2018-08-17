CREATE TABLE IF NOT EXISTS __ScriptHistory (
    Id        INTEGER       PRIMARY KEY AUTOINCREMENT,
    Name      VARCHAR (500) NOT NULL,
    AppliedOn DATETIME      DEFAULT (DATETIME('now', 'localtime') ) 
                            NOT NULL
);