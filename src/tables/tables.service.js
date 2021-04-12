const knex = require("../db/connection");

const list = async () => {
  return await knex("tables").select("*").orderBy("table_name");
};

const create = (table) => {
  return knex("tables").insert(table, "*");
};

module.exports = {
  list,
  create,
};
