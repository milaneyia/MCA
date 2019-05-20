export class Config {
    database : {
        name: string,
        username: string,
        password: string
    }
    constructor() {
        this.database = { // Connect to MariaDB via Sequelize
            name: '', // DB Name
            username: '', // username for access
            password: '' // password for access
        }
    }
}
