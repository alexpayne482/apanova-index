import { sample, sampleDate } from '../../utils';

const locations = [
    { id:  1, name: 'Villa 1' },
    { id:  2, name: 'Villa 2' },
    { id:  3, name: 'Villa 3' },
    { id:  4, name: 'Villa 4' },
    { id:  5, name: 'Villa 5' },
];

export const get = (req, res) => {
    return res.json(getAll());
};

export const getSingle = (req, res) => {
  const location = locations.find((location) => location.id === +req.params.id);
  return res.json(location);
};

function getAll() {
  return { locations: locations };
}
