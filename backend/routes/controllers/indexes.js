import { IndexesDB } from '../../db';

export const get = (req, res) => {
  // TODO: add date range as a param
  // TODO: add location as a param
  const db = new IndexesDB();
  if (req.query.location) {
    return res.json(db.getForLocation(+req.query.location));
  } else {
    console.log(db.getAll());
    return res.json(db.getAll());
  }
};

export const getSingle = (req, res) => {
  const db = new IndexesDB();
  const index = db.get(+req.params.id);
  return res.json(index);
};

