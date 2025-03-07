#!/bin/sh

psql postgresql://postgres@localhost/postgres <<<"
DROP DATABASE demo;
DROP ROLE demo;"
