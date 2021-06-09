import { sample, sampleDate } from '../../utils';

const indexes = [
  { id:  1, location: 1, date: new Date(2020, 10, 29), index: 1122 },
  { id:  2, location: 2, date: new Date(2020, 10, 29), index: 859 },
  { id:  3, location: 3, date: new Date(2020, 10, 29), index: 1282 },
  { id:  4, location: 4, date: new Date(2020, 10, 29), index: 2329 },
  { id:  5, location: 5, date: new Date(2020, 10, 29), index: 3705 },

  { id:  6, location: 1, date: new Date(2020, 11, 27), index: 1124 },
  { id:  7, location: 2, date: new Date(2020, 11, 27), index: 861 },
  { id:  8, location: 3, date: new Date(2020, 11, 27), index: 1291 },
  { id:  9, location: 4, date: new Date(2020, 11, 27), index: 2360 },
  { id: 10, location: 5, date: new Date(2020, 11, 27), index: 3738 },

  { id: 11, location: 1, date: new Date(2021,  1,  5), index: 1131 },
  { id: 12, location: 2, date: new Date(2021,  1,  5), index: 865 },
  { id: 13, location: 3, date: new Date(2021,  1,  5), index: 1301 },
  { id: 14, location: 4, date: new Date(2021,  1,  5), index: 2401 },
  { id: 15, location: 5, date: new Date(2021,  1,  5), index: 3766 },

  { id: 16, location: 1, date: new Date(2021,  2,  2), index: 1136 },
  { id: 17, location: 2, date: new Date(2021,  2,  2), index: 867 },
  { id: 18, location: 3, date: new Date(2021,  2,  2), index: 1311 },
  { id: 19, location: 4, date: new Date(2021,  2,  2), index: 2429 },
  { id: 20, location: 5, date: new Date(2021,  2,  2), index: 3785 },

  { id: 21, location: 1, date: new Date(2021,  3,  2), index: 1142 },
  { id: 22, location: 2, date: new Date(2021,  3,  2), index: 868 },
  { id: 23, location: 3, date: new Date(2021,  3,  2), index: 1323 },
  { id: 24, location: 4, date: new Date(2021,  3,  2), index: 2459 },
  { id: 25, location: 5, date: new Date(2021,  3,  2), index: 3809 },

  { id: 26, location: 1, date: new Date(2021,  3, 30), index: 1146 },
  { id: 27, location: 2, date: new Date(2021,  3, 30), index: 868 },
  { id: 28, location: 3, date: new Date(2021,  3, 30), index: 1329 },
  { id: 29, location: 4, date: new Date(2021,  3, 30), index: 2488 },
  { id: 30, location: 5, date: new Date(2021,  3, 30), index: 3828 },

  { id: 31, location: 1, date: new Date(2021,  4, 28), index: 1153 },
  { id: 32, location: 2, date: new Date(2021,  4, 28), index: 869 },
  { id: 33, location: 3, date: new Date(2021,  4, 28), index: 1335 },
  { id: 34, location: 4, date: new Date(2021,  4, 29), index: 2515 },
  { id: 35, location: 5, date: new Date(2021,  4, 28), index: 3850 },

  { id: 36, location: 1, date: new Date(2021,  6,  2), index: 1160 },
];

export const get = (req, res) => {
  // TODO: add date range as a param
  // TODO: add location as a param
  if (req.query.location) {
    return res.json(getFromLocation(+req.query.location));
  } else {
    return res.json(getAll());
  }
};

export const getSingle = (req, res) => {
  const index = indexes.find((index) => index.id === +req.params.id);
  return res.json(index);
};

function getAll() {
  return { indexes: indexes };
}

function getFromLocation(location = 0) {
  return { indexes: indexes.filter((v, i, a) => v.location === location) };
}

