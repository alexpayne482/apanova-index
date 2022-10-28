import { BillsDB } from '../../db';

export const get = (req, res) => {
  // TODO: add date range as a param
  const db = new BillsDB();
  if (req.query.location) {
    return res.json(db.getForLocation(+req.query.location));
  } else {
    return res.json(db.getAll());
  }
};

