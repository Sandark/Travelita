const Pool = require("pg").Pool;

let dbOptions = {};

if (process.env.DATABASE_URL !== undefined) {
    dbOptions = {
        connectionString: process.env.DATABASE_URL
        // ssl: true
    };
} else {
    dbOptions = {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_SCHEMA,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT
    }
}

const pool = new Pool(dbOptions);

const getTrips = (request, response) => {
    pool.query('SELECT * FROM TRIP ORDER BY ID ASC', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}


const getTripById = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM TRIP WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const createTrip = (request, response) => {
    const { name, city_full_name, img_src, from_date, to_date } = request.body

    pool.query('INSERT INTO TRIP (NAME, CITY_FULL_NAME, IMG_SRC, FROM_DATE, TO_DATE) VALUES ($1, $2, $3, $4, $5)',
        [name, city_full_name, img_src, from_date, to_date], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send(`Trip added with ID: ${result.insertId}`)
    })
}

const updateTrip = (request, response) => {
    const id = parseInt(request.params.id)
    const { name, city_full_name, img_src, from_date, to_date } = request.body

    pool.query(
        'UPDATE TRIP SET name = $1, city_full_name = $2, img_src = $3, from_date = $4, to_date = $5 WHERE id = $3',
        [name, city_full_name, img_src, from_date, to_date, id],
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).send(`Trip modified with ID: ${id}`)
        }
    )
}

const deleteTrip = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM TRIP WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`Trip deleted with ID: ${id}`)
    })
}

module.exports = {
    getTrips,
    getTripById,
    createTrip,
    updateTrip,
    deleteTrip
}