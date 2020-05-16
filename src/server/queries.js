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

const getTripsWithItems = (request, response) => {
    let query = `select t.*, (select json_agg(json_build_object('id', p.id, 'trip_id', p.trip_id,
                                                                     'item_description', p.item_description))
                                   from package_item p
                                   where t.id = p.trip_id) as items
                    from trip t
                    group by t.id`;

    pool.query(query, (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}


const getTripById = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('select * from trip where id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const createTrip = (request, response) => {
    const {name, city_full_name, img_src, from_date, to_date, lat, lng} = request.body

    pool.query('insert into trip (name, city_full_name, img_src, from_date, to_date, lat, lng) values ($1, $2, $3, $4, $5, $6, $7) returning *',
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
        'update trip set name = $2, city_full_name = $3, img_src = $4, from_date = $5, to_date = $6, lat = $7, lng = $8 where id = $1',
        [id, name, city_full_name, img_src, from_date, to_date, lat, lng],
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).json({
                message: `Trip modified with ID: ${id}`});
        }
    )
}

const deleteTrip = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('delete from trip where id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`Trip deleted with ID: ${id}`)
    })
}

const deleteItem = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('delete from package_item where id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`Item deleted with ID: ${id}`)
    })
}

module.exports = {
    getTrips,
    getTripsWithItems,
    getTripById,
    createTrip,
    updateTrip,
    deleteTrip,
    deleteItem
}