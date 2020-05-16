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
    const {name, city_full_name, img_src, from_date, to_date, lat, lng} = request.body

    pool.query('INSERT INTO TRIP (NAME, CITY_FULL_NAME, IMG_SRC, FROM_DATE, TO_DATE, LAT, LNG) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [name, city_full_name, img_src, from_date, to_date, lat, lng], (error, result) => {
            if (error) {
                throw error
            }
            response.status(201).json({
                id: result.rows[0].id,
                message: `Trip added with ID: ${result.rows[0].id}`
            });
        })
}

const updateTrip = (request, response) => {
    const id = parseInt(request.params.id)
    const {name, city_full_name, img_src, from_date, to_date, lat, lng} = request.body

    pool.query(
        'UPDATE TRIP SET name = $2, city_full_name = $3, img_src = $4, from_date = $5, to_date = $6, lat = $7, lng = $8 WHERE id = $1',
        [id, name, city_full_name, img_src, from_date, to_date, lat, lng],
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