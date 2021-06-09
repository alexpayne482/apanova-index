import { sample, sampleDate } from '../../utils';

const invoices = [
  { id:  1, date: new Date(2020, 10, 29), index: 2321, value: 498.35 },
  { id:  2, date: new Date(2020, 11, 27), index: 2400, value: 526.42 },
  { id:  3, date: new Date(2021,  1,  5), index: 2490, value: 517.92 },
  { id:  4, date: new Date(2021,  2,  2), index: 2554, value: 596.36 },
  { id:  5, date: new Date(2021,  3,  2), index: 2624, value: 424.36 },
  { id:  6, date: new Date(2021,  3, 30), index: 2682, value: 461.35 },
  { id:  7, date: new Date(2021,  4, 28), index: 2745, value: 387.36 },
];

export const get = (req, res) => {
  // TODO: add date range as a param
  return res.json(getAll());
};

export const getSingle = (req, res) => {
  const invoice = invoices.find((invoice) => invoice.id === +req.params.id);
  return res.json(invoice);
};

function getAll() {
  return { invoices: invoices };
}
