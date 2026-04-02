const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./flights.db");

db.serialize(() => {

  db.run(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      route TEXT,
      total_cost INTEGER,
      status TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS flights (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source TEXT,
      destination TEXT,
      duration REAL,
      price INTEGER,
      airline TEXT,
      available_seats INTEGER
    )
  `);

  db.get("SELECT COUNT(*) as count FROM flights", (err, row) => {
    if (row.count === 0) {
      db.run(`
        INSERT INTO flights (source, destination, duration, price, airline, available_seats)
        VALUES
        ('HYD','DEL',2,4500,'Air India',20),
        ('DEL','HYD',2,4300,'IndiGo',18),
        ('HYD','MAA',1,2500,'IndiGo',12),
        ('MAA','DEL',2.5,5000,'Vistara',15),
        ('DEL','BOM',2,5000,'Vistara',25),
        ('BOM','BLR',1.5,4000,'IndiGo',18),
        ('BLR','MAA',1,2000,'Air India',15)
      `);
      console.log("Flights inserted ✅");
    }
  });

});

module.exports = db;
