#!/bin/sh

psql postgresql://postgres@localhost/postgres <<<"
CREATE ROLE demo PASSWORD 'demo' LOGIN;
CREATE DATABASE demo;
ALTER DATABASE demo OWNER TO demo;"

dbmate up
