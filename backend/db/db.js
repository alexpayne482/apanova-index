import { NONE_TYPE } from '@angular/compiler';

const Database = require('better-sqlite3');
const db = new Database('./waterusage.db');//, { verbose: console.log });

class DB {
    hasTable(table) {
        return db.prepare(`SELECT count(*) n FROM sqlite_master WHERE type='table' AND name=?`).get(table).n > 0 ? true : false;
    }
    hasData() {
        return this.hasTable('indexes');
    }
}

class IndexesDB {
   
    constructor() {
        db.prepare(`
                CREATE TABLE IF NOT EXISTS indexes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    location INTEGER,
                    date TEXT,
                    [index] INTEGER)
        `).run();
    }

    add(location, date, index) {
        db.prepare('INSERT INTO indexes (location, date, [index]) VALUES (?, ?, ?)').run(location, date.toISOString(), index);
    }

    get(id) {
        return db.prepare('SELECT * FROM indexes WHERE id = ?').get(id);
    }

    getForDate(date1, date2) {
        if (typeof date2 !== 'undefined') {
            return db.prepare('SELECT * FROM indexes WHERE date(date) > date(?) and date(date) <= date(?)').all(date1.toISOString(), date2.toISOString());
        } else {
            return db.prepare('SELECT * FROM indexes WHERE date(date) > date(?)').all(date1.toISOString());
        }
    }

    getForLocation(location) {
        return db.prepare('SELECT * FROM indexes WHERE location = ?').all(location);
    }

    getAll() {
        return db.prepare('SELECT * FROM indexes').all();
    }

    getCount() {
        return db.prepare('SELECT count(*) n FROM indexes').get().n;
    }
}

class LocationsDB {
    constructor() {
        db.prepare(`
                CREATE TABLE IF NOT EXISTS locations (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT)
        `).run();
    }

    add(location) {
        db.prepare('INSERT INTO locations (name) VALUES (?)').run(location);
    }

    get(id) {
        return db.prepare('SELECT * FROM locations WHERE id = ?').get(id);
    }

    getAll() {
        return db.prepare('SELECT * FROM locations').all();
    }

    getCount() {
        return db.prepare('SELECT count(*) n FROM locations').get().n;
    }
}

class InvoicesDB {
    constructor() {
        db.prepare(`
                CREATE TABLE IF NOT EXISTS invoices (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    date TEXT,
                    value REAL,
                    [index] INTEGER)
        `).run();
        //db.prepare('DROP VIEW IF EXISTS v_invoices').run();
        db.prepare(`
                CREATE VIEW IF NOT EXISTS v_invoices
                AS
                SELECT 
                    month,
                    max(datetime(date)) as date,
                    sum(value) as value,
                    max([index]) as [index]
                FROM (
                    SELECT 
                        IIF (cast(strftime('%d', date) as integer) < 18, cast(strftime('%m', date) as integer), IIF(cast(strftime('%m', date) as integer) == 12, 1, cast(strftime('%m', date) as integer) + 1)) as month,
                        date, value, [index] 
                    FROM (
                        SELECT i.date, i.value, i.[index]
                        FROM invoices i
                    ) x
                ) y
                GROUP BY month
        `).run();
    }

    add(date, index, value) {
        db.prepare('INSERT INTO invoices (date, [index], value) VALUES (?, ?, ?)').run(date.toISOString(), index, value);
    }

    get(id) {
        return db.prepare('SELECT * FROM invoices WHERE id = ?').get(id);
    }

    getByDate(date1, date2) {
        if (typeof date2 !== 'undefined') {
            return db.prepare('SELECT * FROM invoices WHERE date(date) > date(?) and date(date) <= date(?)').all(date1.toISOString(), date2.toISOString());
        } else {
            return db.prepare('SELECT * FROM invoices WHERE date(date) > date(?)').all(date1.toISOString());
        }
    }

    getAll() {
        return db.prepare('SELECT * FROM invoices').all();
    }

    getCount() {
        return db.prepare('SELECT count(*) n FROM invoices').get().n;
    }
}

class MeterChangesDB {
    constructor() {
        db.prepare(`
                CREATE TABLE IF NOT EXISTS meter_changes  (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    date TEXT,
                    location INTEGER,
                    old INTEGER,
                    new INTEGER)`).run();
    }

    add(date, location, oldIndex, newIndex) {
        db.prepare('INSERT INTO meter_changes (date, location, old, new) VALUES (?, ?, ?, ?)').run(date.toISOString(), location, oldIndex, newIndex);
    }

    getAll() {
        return db.prepare('SELECT * FROM meter_changes').all();
    }

    getCount() {
        return db.prepare('SELECT count(*) n FROM meter_changes').get().n;
    }
}

class UsageDB {
    constructor() {
        //db.prepare('DROP VIEW IF EXISTS v_usage_agg').run();
        db.prepare(`
                CREATE VIEW IF NOT EXISTS v_usage_agg
                AS
                SELECT 
                    RANK() OVER (
                        PARTITION BY location
                        ORDER BY datetime(date) ASC
                    ) locIdx,
                    IIF (cast(strftime('%d', date) as integer) < 18, cast(strftime('%m', date) as integer), IIF(cast(strftime('%m', date) as integer) == 12, 1, cast(strftime('%m', date) as integer) + 1)) as month,
                    cast(strftime('%Y', date) as integer) as year,
                    date, location, locationName, [index] 
                FROM (
                    SELECT i.date, l.id as location, l.name as locationName, i.[index]
                    FROM indexes i
                        LEFT JOIN locations l ON i.location = l.id
                    UNION
                    SELECT i.date, 0 as location, 'general' as location, i.[index]
                    FROM invoices i
                ) x
        `).run();
        //db.prepare('DROP VIEW IF EXISTS v_usage').run();
        db.prepare(`
                CREATE VIEW IF NOT EXISTS v_usage
                AS
                SELECT
                    max(datetime(date)) as date,
                    year,
                    month, 
                    location, 
                    locationName, 
                    min(oldIndex) as oldIndex, 
                    max(newIndex) as newIndex, 
                    sum(quantity) as quantity, 
                    max(meterChanged) as meterChanged
                FROM (
                    SELECT 
                        x.date, x.year, x.month, x.location, x.locationName, 
                        y.[index] as oldIndex, x.[index] as newIndex,
                        CASE WHEN c.id is not NULL THEN c.old - y.[index] + x.[index] - c.new
                            ELSE x.[index] - y.[index]
                        END as quantity,
                        CASE WHEN c.id is not NULL THEN 1
                            ELSE 0
                        END as meterChanged
                    FROM v_usage_agg x
                        LEFT JOIN v_usage_agg y ON x.location = y.location and x.locIdx - 1 = y.locIdx
                        LEFT JOIN meter_changes c ON x.location = c.location and y.[index] <= c.old and x.[index] >= c.new
                    WHERE y.location is not NULL
                ) y
                GROUP BY year, month, location, locationName
        `).run();
    }

    getForDate(date1, date2) {
        if (typeof date2 !== 'undefined') {
            return db.prepare('SELECT * FROM v_usage WHERE date(date) > date(?) and date(date) <= date(?)').all(date1.toISOString(), date2.toISOString());
        } else {
            return db.prepare('SELECT * FROM v_usage WHERE date(date) > date(?)').all(date1.toISOString());
        }
    }

    getForLocation(location) {
        return db.prepare('SELECT * FROM v_usage WHERE location = ?').all(location);
    }

    get(filter = NONE_TYPE) {
        if (!filter || Object.keys(filter).length === 0) {
            return db.prepare('SELECT * FROM v_usage').all();
        } else {
            let sqlQuery = 'SELECT * FROM v_usage WHERE ';
            let sqlParams = []
            
            if (typeof filter.location != 'undefined') {
                sqlQuery += 'location = ? and ';
                sqlParams.push(filter.location);
            }
            if (typeof filter.from != 'undefined') {
                sqlQuery += 'date(date) > date(?) and ';
                sqlParams.push(filter.from);
            }
            sqlQuery = sqlQuery.replace(/ and $/, '');

            // console.log('UsageDB get: ' + sqlQuery + ' % ' + sqlParams);
            return db.prepare(sqlQuery).all(sqlParams);
        }
    }

    getAll() {
        return db.prepare('SELECT * FROM v_usage').all();
    }

    getCount() {
        return db.prepare('SELECT count(*) n FROM v_usage').get().n;
    }
}

class BillsDB {
    constructor() {
        db.prepare('DROP VIEW IF EXISTS v_bills').run();
        db.prepare(`
                CREATE VIEW IF NOT EXISTS v_bills
                AS
                SELECT 
                    u.month as month,
                    i.date as invoiceDate,
                    i.[index] as invoiceIndex, 
                    i.value as invoiceValue,
                    iu.quantity as invoiceQuantity, 
                    tu.quantity as totalQuantity, 
                    u.date as userDate,
                    u.location as userLocation,
                    u.locationName as userLocationName,
                    u.newIndex as userLastIndex,
                    u.quantity as userQuantity, 
                    round((value / tu.quantity) * u.quantity, 2) as userValue
                FROM v_usage u 
                LEFT JOIN v_invoices i on u.month = i.month
                LEFT JOIN (
                    SELECT month, sum(quantity) quantity 
                    FROM v_usage 
                    WHERE location = 0
                    GROUP BY month
                ) iu on u.month = iu.month
                LEFT JOIN (
                    SELECT month, sum(quantity) quantity 
                    FROM v_usage 
                    WHERE location != 0
                    GROUP BY month
                ) tu on u.month = tu.month
                WHERE u.location != 0
                ORDER BY u.location, u.month
        `).run();
    }

    getForLocation(location) {
        return db.prepare('SELECT * FROM v_bills WHERE userLocation = ?').all(location);
    }

    getAll() {
        return db.prepare('SELECT * FROM v_bills').all();
    }

    getCount() {
        return db.prepare('SELECT count(*) n FROM v_bills').get().n;
    }
}

export { DB, LocationsDB, IndexesDB, InvoicesDB, MeterChangesDB, UsageDB, BillsDB };