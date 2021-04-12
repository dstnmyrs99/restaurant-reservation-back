const service = require("./tables.service");
const wrapper = require("../errors/asyncErrorBoundary");

const list = async (req, res, next) => {
  const tables = await service.list();
  res.json({ data: tables });
};

const create = async (req, res, next) => {
  const newTable = req.body.data;
  await service.create(newTable);
  res.status(201).json({ data: newTable });
};

const isValid = (req, res, next) => {
  const newTable = req.body.data;
  if (!newTable || !newTable.capacity || !newTable.table_name)
    return next({
      status: 400,
      message: `Invalid table parameters, table_name or capacity incorrect.`,
    });
  if (newTable.capacity < 1)
    return next({
      status: 400,
      message: `Must be able to accomodate atleast 1.`,
    });
  if (newTable.table_name.length < 2)
    return next({
      status: 400,
      message: `table_name must be atleast 2 characters.`,
    });
  next();
};

module.exports = {
  list: [wrapper(list)],
  create: [isValid, wrapper(create)],
};
