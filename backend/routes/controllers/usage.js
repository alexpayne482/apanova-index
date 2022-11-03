import { UsageDB } from '../../db';
const util = require('util')

export const get = (req, res) => {
  const db = new UsageDB();
  return res.json(db.get(req.query));
};

export const getSingle = (req, res) => {
  const db = new UsageDB();
  const index = db.get(+req.params.id);
  return res.json(index);
};


