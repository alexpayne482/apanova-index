import { sample, sampleDate } from '../../utils';


// TODO:
// controllers:
//  - auth
//  - users
//  - locations
//  - indexes
//  - invoices


// import { Investigation } from '../../db';

//// water usage
// id
// date
// location
// index

//// invoice
// id
// date
// index
// value (total value)
// quantity ?
// price per unit ?

const locations = ['Villa 1', 'Villa 2', 'Villa 3', 'Villa 4', 'Villa 5']; 
  
const waterIndexes = [
    { id:  1, location: locations[0], date: new Date(2020, 10, 29), index: 1122 },
    { id:  2, location: locations[1], date: new Date(2020, 10, 29), index: 859 },
    { id:  3, location: locations[2], date: new Date(2020, 10, 29), index: 1282 },
    { id:  4, location: locations[3], date: new Date(2020, 10, 29), index: 2329 },
    { id:  5, location: locations[4], date: new Date(2020, 10, 29), index: 3705 },

    { id:  6, location: locations[0], date: new Date(2020, 11, 27), index: 1124 },
    { id:  7, location: locations[1], date: new Date(2020, 11, 27), index: 861 },
    { id:  8, location: locations[2], date: new Date(2020, 11, 27), index: 1291 },
    { id:  9, location: locations[3], date: new Date(2020, 11, 27), index: 2360 },
    { id: 10, location: locations[4], date: new Date(2020, 11, 27), index: 3738 },

    { id: 11, location: locations[0], date: new Date(2021,  1,  5), index: 1131 },
    { id: 12, location: locations[1], date: new Date(2021,  1,  5), index: 865 },
    { id: 13, location: locations[2], date: new Date(2021,  1,  5), index: 1301 },
    { id: 14, location: locations[3], date: new Date(2021,  1,  5), index: 2401 },
    { id: 15, location: locations[4], date: new Date(2021,  1,  5), index: 3766 },

    { id: 16, location: locations[0], date: new Date(2021,  2,  2), index: 1136 },
    { id: 17, location: locations[1], date: new Date(2021,  2,  2), index: 867 },
    { id: 18, location: locations[2], date: new Date(2021,  2,  2), index: 1311 },
    { id: 19, location: locations[3], date: new Date(2021,  2,  2), index: 2429 },
    { id: 20, location: locations[4], date: new Date(2021,  2,  2), index: 3785 },

    { id: 21, location: locations[0], date: new Date(2021,  3,  2), index: 1142 },
    { id: 22, location: locations[1], date: new Date(2021,  3,  2), index: 868 },
    { id: 23, location: locations[2], date: new Date(2021,  3,  2), index: 1323 },
    { id: 24, location: locations[3], date: new Date(2021,  3,  2), index: 2459 },
    { id: 25, location: locations[4], date: new Date(2021,  3,  2), index: 3809 },

    { id: 26, location: locations[0], date: new Date(2021,  3, 30), index: 1146 },
    { id: 27, location: locations[1], date: new Date(2021,  3, 30), index: 868 },
    { id: 28, location: locations[2], date: new Date(2021,  3, 30), index: 1329 },
    { id: 29, location: locations[3], date: new Date(2021,  3, 30), index: 2488 },
    { id: 30, location: locations[4], date: new Date(2021,  3, 30), index: 3828 },

    { id: 31, location: locations[0], date: new Date(2021,  4, 28), index: 1153 },
    { id: 32, location: locations[1], date: new Date(2021,  4, 28), index: 869 },
    { id: 33, location: locations[2], date: new Date(2021,  4, 28), index: 1335 },
    { id: 34, location: locations[3], date: new Date(2021,  4, 29), index: 2515 },
    { id: 35, location: locations[4], date: new Date(2021,  4, 28), index: 3850 },

    { id: 36, location: locations[0], date: new Date(2021,  6,  2), index: 1160 },
];

const waterInvoices = [
    { id:  1, date: new Date(2020, 10, 29), index: 2321, value: 498.35 },
    { id:  1, date: new Date(2020, 11, 27), index: 2400, value: 526.42 },
    { id:  1, date: new Date(2021,  1,  5), index: 2490, value: 517.92 },
    { id:  1, date: new Date(2021,  2,  2), index: 2554, value: 596.36 },
    { id:  1, date: new Date(2021,  3,  2), index: 2624, value: 424.36 },
    { id:  1, date: new Date(2021,  3, 30), index: 2682, value: 461.35 },
    { id:  1, date: new Date(2021,  4, 28), index: 2745, value: 387.36 },
];


export const getLocations = (req, res) => {
  return res.json(getLocationsAll());
};

// TODO: add time period param (startdate enddate)
export const getIndexes = (req, res) => {
  var indexes = [];
  if (req.query.location) {
    indexes = getIndexesFromLocation(req.query.location);
  } else {
    indexes = getIndexesAll();
  }
  return res.json(indexes);
};

// TODO: add time period param (startdate enddate)
export const getInvoices = (req, res) => {
  return res.json(getInvoicesAll());
};

// TODO: add time period param (startdate enddate)
export const get = (req, res) => {
  return res.json(getAll());
}


function getLocationsAll() {
  let locations = waterIndexes.map(el => el.location).filter((v, i, a) => a.indexOf(v) === i).sort();
  return { locations: locations };
}

function getIndexesFromLocation(location) {
  return { indexes: waterIndexes.filter((v, i, a) => v.location === location) };
}

function getIndexesAll() {
  return { indexes: waterIndexes };
}

function getInvoicesAll() {
  return { invoices: waterInvoices };
}

function getAll() {
  let locations = waterIndexes.map(el => el.location).filter((v, i, a) => a.indexOf(v) === i).sort();
  return { locations: locations, indexes: waterIndexes, invoices: waterInvoices };
}
