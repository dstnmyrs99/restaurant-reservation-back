const knex = require("../db/connection");

const list = async (date) => {
  return await knex("reservations")
    .select("*")
    .where({ "reservation_date": date })
    .orderBy("reservation_time");
};
const create = (reservation) => {
  return knex("reservations").insert(reservation, "*");
};

module.exports = {
  list,
  create,
};
