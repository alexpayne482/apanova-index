import { InvoicesDB } from '../../db';

export const get = (req, res) => {
  // TODO: add date range as a param
  const db = new InvoicesDB();
  console.log(db.getAll());
  return res.json(db.getAll());
};

export const getSingle = (req, res) => {
  const db = new InvoicesDB();
  const index = db.get(+req.params.id);
  return res.json(index);
};
