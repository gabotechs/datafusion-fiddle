export const INIT_DDL = `\
CREATE TABLE book (str text);

INSERT INTO book (str) VALUES ('foo'), ('bar'), ('baz')
`

export const INIT_SELECT = `\
SELECT * FROM book
`
