const AppDao = require("./dao")
const UserStandupsRepository = require("./repositories/user-standups-repo")

const dao = new AppDao(process.env.DB_PATH)
const userStandupRepo = new UserStandupsRepository(dao)

function main() {
   initDb()
}

function initDb() {
   //Create tables
   userStandupRepo.createTable()   
           .catch((err) => {
           console.log('Error: ')
           console.log(JSON.stringify(err))
       })

}

module.exports =  { main, userStandupRepo }