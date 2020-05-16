create table trip
(
    id             serial primary key,
    name           varchar(30)  not null,
    city_full_name varchar(100) not null,
    img_src        varchar(200),
    from_date      date,
    to_date        date,
    lat            numeric,
    lng            numeric
);

create table package_item
(
    id               serial primary key,
    trip_id          integer references trip (id) on delete cascade,
    item_description varchar(50)
);