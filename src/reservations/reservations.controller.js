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

const read = async (req, res, next) => {
  const id = req.params.reservation_Id;
  const reservation = await service.read(id);
  res.status(200).json({ data: reservation[0] });
};

const isValid = (req, res, next) => {
  if (!req.body.data) return next({ status: 400, message: "No date selected" });
  const {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
  } = req.body.data;
  const requiredFields = [
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_date",
    "reservation_time",
    "people",
  ];
  for (const field of requiredFields) {
    if (!req.body.data[field]) {
      return next({ status: 400, message: `Invalid input for ${field}` });
    }
  }
  if (
    !reservation_date.match(/\d{4}-\d{2}-\d{2}/g) ||
    typeof people !== "number" ||
    !reservation_time.match(/[0-9]{2}:[0-9]{2}/g)
  )
    return next({
      status: 400,
      message: `Invalid input for reservation_date, reservation_time, or people`,
    });
  res.locals.validReservation = req.body.data;
  next();
};

const create = async (req, res, next) => {
  const newReservation = res.locals.validReservation;
  await service.create(newReservation);
  res.status(201).json({ data: newReservation });
};

const isFutureWorkingDate = (req, res, next) => {
  let newDate = new Date(
    `${req.body.data.reservation_date} ${req.body.data.reservation_time}`
  );
  let currentDay = new Date();
  if (newDate.getDay() === 2 || newDate < currentDay)
    return next({
      status: 400,
      message: `Restaurant is closed on tuesdays and future dates.`,
    });
  next();
};

const isDuringWorkingHours = (req, res, next) => {
  let time = Number(req.body.data.reservation_time.replace(":", ""));
  if (time < 1030 || time > 2130)
    return next({
      status: 400,
      message: `Reservations are only valid from 10:30 AM to 9:30 PM.`,
    });
  next();
};

module.exports = {
  list: [wrapper(list)],
  read,
  create: [isValid, isFutureWorkingDate, isDuringWorkingHours, wrapper(create)],
};
