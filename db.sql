drop table if exists package_item;
drop table if exists trip;

create sequence if not exists id_sequence start 1001;

create table trip
(
    id             integer primary key not null default nextval('id_sequence'),
    name           varchar(30)        not null,
    city_full_name varchar(100)       not null,
    img_src        varchar(200),
    from_date      date,
    to_date        date,
    lat            numeric,
    lng            numeric
);

create table package_item
(
    id               integer primary key not null default nextval('id_sequence'),
    trip_id          integer references trip (id) on delete cascade,
    item_description varchar(50)
);
