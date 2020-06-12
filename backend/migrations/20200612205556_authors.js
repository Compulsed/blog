
exports.up = async function(knex) {
  await knex.raw(`
    CREATE TABLE "engineer" (
      engineerName TEXT PRIMARY KEY NOT NULL
    );

    CREATE TABLE "team" (
      teamName TEXT PRIMARY KEY NOT NULL
    );

    CREATE TABLE "engineer-team" (
      engineerName TEXT REFERENCES "engineer"(engineerName),
      teamName TEXT REFERENCES "team"(teamName),
      startDate DATE,
      endDate DATE
    );

    INSERT INTO engineer (engineerName) VALUES('Dale Salter');

    INSERT INTO team (teamName) VALUES('Student');
    INSERT INTO team (teamName) VALUES('Organisation');

    INSERT INTO "engineer-team"
      (engineerName, teamName, startDate, endDate)
    VALUES
      ('Dale Salter', 'Student', '2016-01-01', '2020-05-15');

    INSERT INTO "engineer-team"
      (engineerName, teamName, startDate)
    VALUES
      ('Dale Salter', 'Organisation', '2020-05-16');
    `
  );
};

exports.down = async function(knex) {
  
};
