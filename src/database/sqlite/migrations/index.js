const sqliteConnection = require('../../sqlite')
const createMachine = require('./createMachine')

async function migrationsRun(){
  const schemas = [
    createMachine
  ].join('')

  sqliteConnection()
    .then(db => db.exec(schemas))
    .catch(error => console.error(error))
}
module.exports = migrationsRun