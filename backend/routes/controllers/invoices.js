import { NONE_TYPE } from '@angular/compiler';
import { InvoicesDB } from '../../db';

export const get = (req, res) => {
  // TODO: add date range as a param
  const db = new InvoicesDB();
  console.log('get invoces, period: ' + req.query.period + ', page: ' + req.query.page)
  let date = new Date();
  switch (req.query.period) {
    case 'all':    
      return res.json({ invoices: db.getAll() });
    case 'year':
      date.setFullYear(date.getFullYear() - 1);
      break;
    case 'month6':
      date.setMonth(date.getMonth() - 6);
      break;
    case 'month3':
      date.setMonth(date.getMonth() - 3);
      break;
    case 'month':
      date.setMonth(date.getMonth() - 1);
      break;
  }
  return res.json({ invoices: db.getByDate(date) });

};

export const getSingle = (req, res) => {
  const db = new InvoicesDB();
  const index = db.get(+req.params.id);
  return res.json(index);
};
