const sqlite3 = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

export default {
    init(userDataPath) {
        if(db == null){
            var dbName = "testDB.db";
            var dbPath = path.join(userDataPath, "data", dbName);
            console.log("db.js path: " + dbPath);
            var db = new sqlite3(dbPath, { verbose: console.log });
            this.db = db;
            this.checkTables();
            console.log("db opened");
        }
    },
    checkTables() {
        const check = this.db.prepare("SELECT * FROM sqlite_master;");
        var rslt = check.all();
        //console.log(rslt);
        if (rslt.length==0) {
            console.log("create table");
            this.db.prepare("CREATE TABLE Zamestnanci (Meno	TEXT NOT NULL, Priezvisko TEXT NOT NULL, ID	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE);").run();
            this.db.prepare("CREATE TABLE Doklady (Suma	NUMERIC NOT NULL, Preplatene NUMERIC, ZAM_ID INTEGER,Schvalene	INTEGER,Poznamka TEXT, "+
            "ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, "+
            "FOREIGN KEY(ZAM_ID) REFERENCES Zamestnanci(ID) ON DELETE CASCADE);").run();
            
        }
    },

    addZamestnanec(meno, priezvisko) {
        const check = this.db.prepare("SELECT 1 FROM Zamestnanci WHERE Meno=? AND Priezvisko=?;");
        const exists = check.get(meno, priezvisko);
        console.log("CHECKING RESULT "+ exists);
        if(exists == null){
            const stmt = this.db.prepare("INSERT INTO Zamestnanci (Meno,Priezvisko) VALUES (?,?);");
            return stmt.run(meno, priezvisko);
        } else {
            throw "Entry already exists"
        }
    },

    addDoklad(suma, preplatene, schvalene, poznamka, id) {
        const stmt = this.db.prepare("INSERT INTO Doklady (Suma,Preplatene,Schvalene,Poznamka,ZAM_ID) VALUES (?,?,?,?,?);")
        return stmt.run(suma,preplatene,schvalene,poznamka,id);
    },
    removeDoklad(id){
        const stmt = this.db.prepare("DELETE FROM Doklady WHERE ID=?");
        return stmt.run(id);
    },
    getDoklad(id) {
        const stmt = this.db.prepare("SELECT * FROM Doklady WHERE ID=?");
        console.log(stmt.all(id));
        return stmt.get(id);
    },
    updateDoklad(suma, preplatene, schvalene, poznamka, id) {
        const stmt = this.db.prepare("UPDATE Doklady SET Suma=?,Preplatene=?,Schvalene=?,Poznamka=? WHERE ID=?;")
        return stmt.run(suma,preplatene,schvalene,poznamka,id);
    },
    getDoklady(zam_id) {
        const stmt = this.db.prepare("SELECT * FROM Doklady WHERE ZAM_ID=?;");
        console.log(stmt.all(zam_id));
        return stmt.all(zam_id);
    },
    getZamData(id) {
        const stmt = this.db.prepare("SELECT * FROM Doklady INNER JOIN Zamestnanci ON Doklady.ZAM_ID=Zamestnanci.ID;");
        return stmt.all();
    },
    getZamestnanec(id) {
        const stmt = this.db.prepare("SELECT * FROM Zamestnanci WHERE ID=?;");
        console.log(stmt.get(id));
        return stmt.get(id);
    }






}

function addToDb(meno, priezvisko) {
    const stmt = this.db.prepare("INSERT INTO Zamestnanci (Meno,Priezvisko) VALUES (?,?);");
    return stmt.run(meno, priezvisko);
}

function setDb(db){
    this.db = db;
}
// getRows() {
//     this.db.serialize(function(){
//         this.db.each("SELECT * FROM Zamestnanci", function (err, row) {
//             document.getElementById("content").append(JSON.stringify(row));
//             console.log(row);
//         })
//     })
// }   


// TODO: move to controller
// document.getElementById("add").addEventListener("click", addToDb, false);
// document.getElementById("remove").addEventListener("click", removeFromDb, false);
// document.getElementById("get").addEventListener("click", getDb, false);


// export function addToDb() {
//     const stmt = this.db.prepare("INSERT INTO Zamestnanci (Meno,Priezvisko) VALUES ('test','test');");
//     return stmt.run();
// }

// removeFromDb() {
//     this.db.exec("DELETE FROM Zamestnanci WHERE Meno = 'test';")
// }

export function getAll(){
    const stmt = this.db.prepare('SELECT * FROM Zamestnanci;').all();
    //console.log(stmt);
    return stmt;
}

export function removeAll(){
    const stmt = this.db.prepare('DELETE FROM Zamestnanci;');
    this.db.prepare('DELETE FROM sqlite_sequence WHERE NAME="Zamestnanci";').run();
    return stmt.run();
}

export function closeDb(){
    this.db.close();
}

