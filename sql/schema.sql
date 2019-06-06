create database restaurantapp;

create table restaurants (
    id serial primary key,
    name varchar(200),
    address varchar(200),
    street varchar(200),
    city varchar(200),
    state varchar(50),
    menu varchar(500)
);

create table users (
    id serial primary key,
    first_name varchar(100),
    last_name varchar(100),
    email varchar(200),
    password varchar(500)
);

create table reviews (
    id serial primary key,
    score integer,
    content text,
    restaurant_id integer references restaurants(id),
    user_id integer references users(id)
);