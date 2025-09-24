export const QUERIES = {
  // sample: `SELECT * FROM ALL_OBJECTS WHERE OBJECT_TYPE = 'FUNCTION' ORDER BY OBJECT_NAME`,
  sample: `SELECT 1 as name1, 2 as name2, 3123123123 as name5
FROM dual`,
  tables: `SELECT
  TABLE_NAME
FROM ALL_TABLES
WHERE
  OWNER NOT IN (
    'SYS',
    'SYSTEM',
    'SYSMAN',
    'CTXSYS',
    'MDSYS',
    'OLAPSYS',
    'EXFSYS',
    'DBSNMP',
    'ORACLE_OCM'
  )
ORDER BY
  TABLE_NAME`,
  views: `SELECT
  VIEW_NAME
FROM ALL_VIEWS
WHERE
  OWNER NOT IN (
    'SYS',
    'SYSTEM',
    'SYSMAN',
    'CTXSYS',
    'MDSYS',
    'OLAPSYS',
    'EXFSYS',
    'DBSNMP',
    'ORACLE_OCM'
  )
ORDER BY
  VIEW_NAME`,
  packages: `SELECT
  OBJECT_NAME
FROM ALL_OBJECTS
WHERE
  OBJECT_TYPE IN ('PACKAGE')
  AND OWNER NOT IN (
    'SYS',
    'SYSTEM',
    'SYSMAN',
    'CTXSYS',
    'MDSYS',
    'OLAPSYS',
    'EXFSYS',
    'DBSNMP',
    'ORACLE_OCM'
  )
ORDER BY
  OBJECT_NAME`,
  procedures: `SELECT
  OBJECT_NAME
FROM ALL_OBJECTS
WHERE
  OBJECT_TYPE IN ('PROCEDURE')
  AND OWNER NOT IN (
    'SYS',
    'SYSTEM',
    'SYSMAN',
    'CTXSYS',
    'MDSYS',
    'OLAPSYS',
    'EXFSYS',
    'DBSNMP',
    'ORACLE_OCM'
  )
ORDER BY
  OBJECT_NAME`,
  functions: `SELECT
  OBJECT_NAME
FROM ALL_OBJECTS
WHERE
  OBJECT_TYPE IN ('FUNCTION')
  AND OWNER NOT IN (
    'SYS',
    'SYSTEM',
    'SYSMAN',
    'CTXSYS',
    'MDSYS',
    'OLAPSYS',
    'EXFSYS',
    'DBSNMP',
    'ORACLE_OCM'
  )
ORDER BY
  OBJECT_NAME`,
  definition(objectName: string) {
    return `SELECT TEXT
      FROM ALL_SOURCE
      WHERE NAME = '${objectName}'
      ORDER BY LINE`;
  },
  select(objectName: string) {
    return `SELECT *
FROM ${objectName}`;
  },
};
