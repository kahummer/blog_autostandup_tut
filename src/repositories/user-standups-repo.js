class UserStandup {
    constructor(dao) {
        this.dao = dao
    }
    createTable() {
        const sql = `
        CREATE TABLE IF NOT EXISTS user_standups(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            standup_today TEXT  NOT NULL,
            team TEXT NULL,                     
            standup_previous TEXT NULL,
            date_posted TEXT NOT NULL
        )
        `
        return this.dao.run(sql)
    }
    add(userStandup) {
        console.log('inside add =====>', userStandup)
        
        const { username, standup_today, team, standup_previous, date_posted} = userStandup
        const insertStatement = `INSERT INTO user_standups (username,standup_today,team,standup_previous,date_posted)
         VALUES (?,?,?,?,?)`
         console.log('insert statement', insertStatement);
         console.log('query', this.dao.run(insertStatement, [username, standup_today, team, standup_previous, date_posted]))
    }
 
   }
   module.exports = UserStandup 