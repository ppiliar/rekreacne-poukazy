const sqlite3 = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

export default {
    init(userDataPath) {
        if(this.db == null){
            var dbName = "rekredb.db";
            var dbPath = path.join(userDataPath, "data", dbName);
            console.log("db.js path: " + dbPath);
            var db = new sqlite3(dbPath, { verbose: console.log });
            this.db = db;
            this.checkTables();
            console.log("db opened");
        }
    },
    close(){
        if(this.db!=null){
            this.db.close();
        }
    },
    checkTables() {
        const check = this.db.prepare("SELECT * FROM sqlite_master;");
        var rslt = check.all();
        if (rslt.length==0) {
            console.log("create table");
            this.db.prepare("CREATE TABLE Zamestnanci (Meno	TEXT NOT NULL, Priezvisko TEXT NOT NULL, ID	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE);").run();
            this.db.prepare("CREATE TABLE Doklady (Suma	NUMERIC NOT NULL, Preplatene NUMERIC, ZAM_ID INTEGER,Schvalene	INTEGER,Poznamka TEXT, "+
            " Rok INTEGER NOT NULL, ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, "+
            "FOREIGN KEY(ZAM_ID) REFERENCES Zamestnanci(ID) ON DELETE CASCADE);").run();
            
        }
    },

    addZamestnanec(meno, priezvisko) {
        const check = this.db.prepare("SELECT 1 FROM Zamestnanci WHERE Meno=? AND Priezvisko=?;");
        const exists = check.get(meno, priezvisko);
        if(exists == null){
            const stmt = this.db.prepare("INSERT INTO Zamestnanci (Meno,Priezvisko) VALUES (?,?);");
            return stmt.run(meno, priezvisko);
        } else {
            throw "Entry already exists"
        }
    },

    addDoklad(suma, preplatene, schvalene, poznamka, rok, id) {
        const stmt = this.db.prepare("INSERT INTO Doklady (Suma,Preplatene,Schvalene,Poznamka,Rok,ZAM_ID) VALUES (?,?,?,?,?,?);")
        return stmt.run(suma,preplatene,schvalene,poznamka,rok,id);
    },
    removeDoklad(id){
        const stmt = this.db.prepare("DELETE FROM Doklady WHERE ID=?");
        return stmt.run(id);
    },
    getDoklad(id) {
        const stmt = this.db.prepare("SELECT * FROM Doklady WHERE ID=?;");
        return stmt.get(id);
    },
    updateDoklad(suma, preplatene, schvalene, poznamka, rok, id) {
        const stmt = this.db.prepare("UPDATE Doklady SET Suma=?,Preplatene=?,Schvalene=?,Poznamka=?,Rok=? WHERE ID=?;")
        return stmt.run(suma,preplatene,schvalene,poznamka,rok,id);
    },
    getDoklady(zam_id, rok) {
        const stmt = this.db.prepare("SELECT * FROM Doklady WHERE ZAM_ID=? AND Rok=?;");
        return stmt.all(zam_id, rok);
    },
    getZamestnanec(id) {
        const stmt = this.db.prepare("SELECT * FROM Zamestnanci WHERE ID=?;");
        return stmt.get(id);
    },
    removeZamestnanec(id) {
        const stmt = this.db.prepare('DELETE FROM Zamestnanci WHERE ID=?');
        return stmt.run(id);
    },
    getZamestnanci() {
        const stmt = this.db.prepare('SELECT * FROM Zamestnanci;').all();
        return stmt;
    },
    getRoky() {
        const stmt = this.db.prepare("SELECT Rok FROM Doklady GROUP BY Rok;");
        return stmt.all();
    }
}