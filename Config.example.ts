export class Config {
    database : {
        name: string,
        username: string,
        password: string
    }
    osuApi : {
        id: number,
        redirect: string
        secret: string,
    }
    constructor() {
        this.database = { // Connect to MariaDB via Sequelize
            name: '', // DB Name
            username: '', // username for access
            password: '' // password for access
        },
        this.osuApi = {
            id: 0,
            redirect: '',
            secret: ''
        }
    }
}
