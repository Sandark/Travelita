const Pool = require("pg").Pool;

let dbOptions = {};

/* create connection properties for DB */
if (process.env.DATABASE_URL !== undefined) {
    dbOptions = {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
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

/* Retrieves trips without package items */
const getTrips = (request, response) => {
    pool.query('SELECT * FROM TRIP ORDER BY ID ASC', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

/* Retrieves trips with package items*/
const getTripsWithItems = (request, response) => {
    let query = `select t.*, (select json_agg(json_build_object('id', p.id, 'trip_id', p.trip_id,
                                               'item_description', p.item_description))
                             from package_item p
                             where t.id = p.trip_id) as items
                 from trip t
                 order by t.from_date asc`;

    pool.query(query, (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

/* Retrieves trip by id without package items */
const getTripById = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('select * from trip where id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

/* Sub-query that used to retrieve updated trip with all package items after insert/update */
const getTripByIdWithItemsQuery = (id) => {
    return `select t.*, (select json_agg(json_build_object('id', p.id, 'trip_id', p.trip_id,
                                               'item_description', p.item_description))
                             from package_item p
                             where t.id = p.trip_id) as items
                from trip t
                where t.id = ${id}
                group by t.id
                `;
}

/* Creates trip and all related package items*/
const createTrip = (request, response) => {
    const {name, city_full_name, img_src, from_date, to_date, lat, lng, items} = request.body;

    pool.query('insert into trip (name, city_full_name, img_src, from_date, to_date, lat, lng) values ($1, $2, $3, $4, $5, $6, $7) returning trip.id',
        [name, city_full_name, img_src, from_date, to_date, lat, lng])
        .then(res => {
            adjustItems(res.rows[0].id, items)
            return res;
        })
        .then(res => {
            pool.query(getTripByIdWithItemsQuery(res.rows[0].id)).then(res => response.status(201).json(res.rows[0]));
        });
}

/* Updates trip and all related package items */
const updateTrip = (request, response) => {
    const id = parseInt(request.params.id)
    const {name, city_full_name, img_src, from_date, to_date, lat, lng, items} = request.body

    pool.query(
        'update trip set name = $2, city_full_name = $3, img_src = $4, from_date = $5, to_date = $6, lat = $7, lng = $8 where id = $1',
        [id, name, city_full_name, img_src, from_date, to_date, lat, lng])
        .then(res => {
            adjustItems(id, items);
            return res;
        })
        .then(res => {
            pool.query(getTripByIdWithItemsQuery(id)).then(res => response.status(200).json(res.rows[0]));
        });
}

/* Updates/Inserts package items depending on id state */
const adjustItems = (tripId, items) => {
    let itemsUpdateQuery = items.map(i => `(${i.id === null ? "nextval('id_sequence')" : i.id}, ${tripId}, '${i.description}')`).join(",");
    if (itemsUpdateQuery !== "") {
        pool.query(`insert into package_item (id, trip_id, item_description) values ${itemsUpdateQuery} on conflict (id) do update set trip_id = excluded.trip_id, item_description = excluded.item_description`);
    }
}

/* Deletes single trip and all package items (cascade delete is setup on DB side) */
const deleteTrip = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('delete from trip where id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`Trip deleted with ID: ${id}`)
    })
}

/* Deletes single item, used when user triggers item removal on UI */
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