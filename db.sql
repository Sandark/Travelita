create table trip
(
    id serial primary key,
    name varchar(30) not null,
    city_full_name varchar(100) not null,
    img_src varchar(200),
    from_date date,
    to_date date,
    lat numeric,
    lng numeric
);

