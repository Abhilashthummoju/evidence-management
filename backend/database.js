const sqlite3 = require('sqlite3').verbose();
require('dotenv').config({ path: '../.env' });


// Connect to SQLite database
const db = new sqlite3.Database('./evidence.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Insert function to be exported
const db_insert_case = async (caseNo, caseName, fileName, fileType) => {
    try {
        const caseExists = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM [Case] WHERE Case_no = ?', [caseNo], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });

        if (caseExists) {
            console.log("Document exists!");
            const returnedstatement = await update_doc(caseNo, caseName, fileName, fileType); //Updating in this case
            return returnedstatement;
        } else {
            console.log("Document does not exist.");
            await insert_doc(caseNo, caseName, fileName, fileType);  //Inserting in this case
            return true;
        }

    } catch (error) {
        console.log(error);
    }
}

// Insert document if new case number is registered
const insert_doc = async (case_No, case_Name, file_Name, file_Type) => {
    const evidences = JSON.stringify([{ File_name: file_Name, File_type: file_Type }]);
    db.run('INSERT INTO [Case] (Case_no, Case_name, Evidences) VALUES (?, ?, ?)', [case_No, case_Name, evidences], function (err) {
        if (err) {
            console.log('Error inserting document:', err.message);
        } else {
            console.log("New Case Document Created");
        }
    });
}

// Update document to store more evidence if the case number is already present
const update_doc = async (case_No, case_Name, file_Name, file_Type) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT Evidences FROM [Case] WHERE Case_no = ?', [case_No], (err, row) => {
            if (err) {
                reject(err);
            } else if (row) {
                let evidences = JSON.parse(row.Evidences);
                evidences.push({ File_name: file_Name, File_type: file_Type });

                db.run('UPDATE Case SET Evidences = ? WHERE Case_no = ?', [JSON.stringify(evidences), case_No], function (err) {
                    if (err) {
                        reject('Error updating document:', err.message);
                    } else {
                        resolve(true);
                    }
                });
            } else {
                resolve(false);
            }
        });
    });
}

// Verify ID
const check_id = async (_id_) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM People WHERE id = ?', [_id_], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(!!row);
            }
        });
    });
}

// Find evidences by case number
const find_evidences = async (_caseNo_) => {
    console.log("CASE NO", _caseNo_)
    return new Promise((resolve, reject) => {
        db.get('SELECT Evidences FROM [Case] WHERE Case_no = ?', [_caseNo_], (err, row) => {
            if (err) {
                reject(err);
            } else if (row) {
                const evidences = JSON.parse(row.Evidences);
                const fileNames = evidences.map(evidence => evidence.File_name);
                const fileTypes = evidences.map(evidence => evidence.File_type);
                resolve([fileNames, fileTypes]);
            } else {
                resolve([false]);
            }
        });
    });
}

const view_all_cases = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM [Case]', [], (err, rows) => {
            if (err) {
                console.error("Database error:", err); // Log the error if it occurs
                reject(err);
            } else {
                console.log("Cases retrieved:", rows); // Log the retrieved cases
                resolve(rows);
            }
        });
    });
}

// Add a new user
const add_user = async ({ id, name, userType }, passwd) => {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO People (id, name, department, password) VALUES (?, ?, ?, ?)', [id, name, userType, passwd], function (err) {
            if (err) {
                console.log('Error:', err.message);
                resolve("error");
            } else {
                console.log("New user Document Created");
                resolve("success");
            }
        });
    });
}

// Delete a user
const delete_user = async ({ id }) => {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM People WHERE id = ?', [id], function (err) {
            if (err) {
                console.log('Error:', err.message);
                resolve("Error");
            } else {
                resolve("success");
            }
        });
    });
}

// Add a new admin
const add_admin = async ({ id }, passwd) => {
    console.log("REQ PASS", id, passwd)
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO Admins (id, password) VALUES (?, ?)', [id, passwd], function (err) {
            if (err) {
                console.log('Error:', err.message);
                resolve("error");
            } else {
                console.log("New Admin Document Created");
                resolve("success");
            }
        });
    });
}

// Delete an admin
const delete_admin = async ({ id }) => {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM Admins WHERE id = ?', [id], function (err) {
            if (err) {
                console.log('Error:', err.message);
                resolve("Error");
            } else {
                resolve("success");
            }
        });
    });
}

// Fetch all admins
const get_all_admins = async () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM Admins', (err, rows) => {
            if (err) {
                console.log('Error:', err.message);
                reject("Error fetching admins");
            } else {
                resolve(rows);
            }
        });
    });
}

// Fetch case name by case number
const fetch_caseName = async (caseNo) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT Case_name FROM [Case] WHERE Case_no = ?', [caseNo], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row.Case_name);
            }
        });
    });
}

module.exports = {
    db_insert_case,
    check_id,
    find_evidences,
    add_user,
    delete_user,
    add_admin,
    delete_admin,
    fetch_caseName,
    get_all_admins,
    view_all_cases
};
