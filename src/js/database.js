// Built in
const path = require('path')

// 3rd Party
const { app } = require('electron')
var Datastore = require('nedb')

DATABASE_FILE_NAME = 'jira_client_database'

// Load in our database
var userData = app.getAppPath('userData');
db = new Datastore({ filename:  path.join(userData, DATABASE_FILE_NAME), autoload: true });

function AddUserData(newUserData) {
    db.find({domain: newUserData['domain']}, function (err, existingData) {
        // This should not happen
        if (existingData.length != 0) {
            console.log('User data already exists!')
            return;
        }

        db.insert(newUserData, function (err, newData) {
            console.log('Added user data to the database!')
        })

    })
}

function UpdateUser(newUserData) {
    db.update({ domain: newUserData['domain'] }, newUserData, {}, function (err, numReplaced) {
        // This should not happen
        if (numReplaced.length == 0) {
            console.log('No user found for given domain name')
            resolve(null)
        } else {
            console.log('updated record')
        }

    });
}

async function GetUser(domainName) {
    const findUserPromise = new Promise(async (resolve, reject) => {
        db.find({domain: domainName}, function (err, existingData) {
            // This should not happen
            if (existingData.length == 0) {
                console.log('No user found for given domain name')
                resolve(null)
            }

            if (existingData.length > 1) {
                console.log('too many users found for given domain name')
                resolve(null)
            }

            resolve(existingData[0])
        })
    })
    return await findUserPromise;
}

async function FindExistingUser() {
    const findExistingUserPromise = new Promise(async (resolve, reject) => {
        db.find({}, function (err, existingData) {
            // This should not happen
            if (existingData.length == 0) {
                console.log('No user found for given domain name')
                resolve(null)
            }

            if (existingData.length > 1) {
                console.log('too many users found for given domain name')
                resolve(null)
            }

            resolve(existingData[0])
        })
    })
    return await findExistingUserPromise;
}

function DeleteUser(domainName) {
    db.remove({ domain: domainName }, function (err, numRemoved) {
        if (numRemoved == 0) {
            console.log('unable to delete user')
        } else {
            console.log('delete user')
        }
    })
}

module.exports = { AddUserData, GetUser, DeleteUser, UpdateUser, FindExistingUser }