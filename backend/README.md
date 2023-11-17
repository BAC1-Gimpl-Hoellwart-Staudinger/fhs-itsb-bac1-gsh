# Backend
This directory consists of a django project, where the dependency
management is done via poetry. The REST API endpoints are served by
the djangorestframework.

## Installation
1. Install [poetry](https://python-poetry.org/docs/#installation)
2. Install dependencies: `poetry install`
3. Activate virtual environment: `poetry shell`
4. Run server: `python manage.py runserver`
5. You may also run `poetry run python manage.py runserver`
