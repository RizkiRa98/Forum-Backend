import { Sequelize } from "sequelize";

const db = new Sequelize("db_forum", "postgres", "nosaya085860", {
  host: "localhost",
  dialect: "postgres",
});

export default db;
