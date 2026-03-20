rm -R -f ./migrations &&
pipenv run init &&
dropdb -h localhost -U gitpod example || true &&
createdb -h localhost -U gitpod example 2>/dev/null || true &&
psql -h localhost example -U gitpod -c "CREATE EXTENSION IF NOT EXISTS unaccent;" || true &&
pipenv run migrate &&
pipenv run upgrade
