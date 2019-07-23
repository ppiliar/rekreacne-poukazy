const sqlite3 = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

export class DbModel {
    
    constructor(userDataPath){
        var dbName = "/data/testDB.db";
        var dbPath = path.join(userDataPath,dbName);
        console.log("db.js path: "+ dbPath);
        var db = new sqlite3(dbPath, { verbose: console.log});
        console.log("db opened");
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


    addToDb() {
        const stmt = this.db.prepare("INSERT INTO Zamestnanci (Meno,Priezvisko) VALUES ('test','test');");
        return stmt.run();
    }

    // removeFromDb() {
    //     this.db.exec("DELETE FROM Zamestnanci WHERE Meno = 'test';")
    // }

    getAll(){
        const stmt = this.db.prepare('SELECT * FROM Zamestnanci;').all();
        //console.log(stmt);
        return stmt;
    }

    removeAll(){
        const stmt = this.db.prepare('DELETE FROM Zamestnanci;');
        this.db.prepare('DELETE FROM sqlite_sequence WHERE NAME="Zamestnanci";').run();
        return stmt.run();
    }

    remove(id) {
        const stmt = this.db.prepare('DELETE FROM Zamestnanci WHERE ID=?');
        return stmt.run(id);
    }

    closeDb(){
        this.db.close();
    }
}
