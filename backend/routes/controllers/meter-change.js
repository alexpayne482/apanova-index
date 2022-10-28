import { MeterChangesDB } from '../../db';

export const get = (req, res) => {
  const db = new MeterChangesDB();
  return res.json(db.getAll());
};

