import { DB, LocationsDB, IndexesDB, InvoicesDB, MeterChangesDB, UsageDB, BillsDB } from './index.js';


const locations = [
    { id: 1, name: 'Villa 1' },
    { id: 2, name: 'Villa 2' },
    { id: 3, name: 'Villa 3' },
    { id: 4, name: 'Villa 4' },
    { id: 5, name: 'Villa 5' },
];

function initLocationsDBData() {
    console.log('init DB Locations');
    const db = new LocationsDB();
    for (let i in locations) {
        const item = locations[i];
        db.add(item.name);
    }
}

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

function initIndexesDBData() {
    console.log('init DB Indexes');
    const db = new IndexesDB();
    for (let i in indexes) {
        const item = indexes[i];
        db.add(item.location, item.date, item.index);
    }
    //console.log(db.getAll());
}

const invoices = [
    { id:  1, date: new Date(2020, 10, 29), index: 2321, value: 498.35 },
    { id:  2, date: new Date(2020, 11, 27), index: 2400, value: 526.42 },
    { id:  3, date: new Date(2021,  1,  5), index: 2490, value: 517.92 },
    { id:  4, date: new Date(2021,  2,  2), index: 2554, value: 596.36 },
    { id:  5, date: new Date(2021,  3,  2), index: 2624, value: 424.36 },
    { id:  6, date: new Date(2021,  3, 30), index: 2682, value: 461.35 },
    { id:  7, date: new Date(2021,  4, 28), index: 2745, value: 387.36 },
];

function initInvoicesDBData() {
    console.log('init DB Invoices');
    const db = new InvoicesDB();
    for (let i in invoices) {
        const item = invoices[i];
        db.add(item.date, item.index, item.value);
    }
}

const meterChanges = [
    // { id:  1, date: new Date(2021,  2, 19), location: 0, old: 2430, new: 2480 },
];

function initMeterChangesDBData() {
    console.log('init DB Invoices');
    const db = new MeterChangesDB();
    for (let i in meterChanges) {
        const item = meterChanges[i];
        db.add(item.date, item.location, item.old, item.new);
    }
}
function initDBData() {
    if ((new DB()).hasData()) {
        console.log('skip DB init as it already has data');
        return;
    }
    console.log('init DBs');

    initLocationsDBData();
    initIndexesDBData();
    initInvoicesDBData();
    initMeterChangesDBData();

    console.log('init UsageDB');
    const udb = new UsageDB();

    console.log('init BillsDB');
    const bdb = new BillsDB();

    console.log('done');
}

export { initDBData };