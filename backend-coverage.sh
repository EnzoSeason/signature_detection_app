docker-compose run backend coverage run -m pytest .
docker-compose run backend coverage report -i -m --skip-covered
docker system prune -f