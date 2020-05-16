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

const updateTrip = (request, response) => {
    const id = parseInt(request.params.id)
    const {name, city_full_name, img_src, from_date, to_date, lat, lng, items} = request.body

    console.log(items);

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

const adjustItems = (tripId, items) => {
    // Delete items that not present in updated list
    let updatedIds = items.map(i => i.id).filter(i => i !== null).join(",")

    let itemsUpdateQuery = items.filter(i => i.id !== null).map(i => `(${i.id}, ${i.tripId}, '${i.description}')`).join(",");
    if (itemsUpdateQuery !== "") {
        pool.query(`insert into package_item (id, trip_id, item_description) values ${itemsUpdateQuery} on conflict (id) do update set trip_id = excluded.trip_id, item_description = excluded.item_description`);
    }

    let itemsQuery = items.filter(i => i.id === null).map(i => `(${i.tripId}, '${i.description}')`).join(",");
    if (itemsQuery !== "") {
        pool.query(`insert into package_item (trip_id, item_description) values ${itemsQuery}`);
    }
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