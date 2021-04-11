/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const wrapper = require("../errors/asyncErrorBoundary");

async function list(req, res, next) {
  const date = req.query.date;
  if (!date) return next({ status: 400, message: "No date selected" });
  const data = await service.list(date);
  res.json({ data });
}

const isValid = (req, res, next) => {
  console.log(req.body.data);
  const {
    data: {
      first_name,
      last_name,
      mobile_number,
      reservation_date,
      reservation_time,
      people,
    },
  } = req.body;
  const requiredFields = [
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_date",
    "reservation_time",
    "people",
  ];
  if (!reservation_date.match(/\d{4}\-\d{2}\-\d{2}/g))
    return next({ status: 400, message: `Invalid input for ${field}` });
  for (const field of requiredFields) {
    if (!req.body.data || !req.body.data[field]) {
      return next({ status: 400, message: `Invalid input for ${field}` });
    }
  }
  res.locals.validReservation = req.body.data;
  next();
};

const create = async (req, res, next) => {
  const newReservation = res.locals.validReservation;
  const saved = await service.create(newReservation);
  res.status(201).json({ data: newReservation });
};

module.exports = {
  list: [wrapper(list)],
  create: [wrapper(isValid), wrapper(create)],
};
