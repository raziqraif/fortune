Environment variables you might want to set (or just use docker-compose and set
them in the file)
- `FLASK_ENV`
  Values:
  - `DEVELOPMENT`
  - `TESTING`
  - `PRODUCTION`
- `DB_HOST`
- `DB_USER`
- `DB_PORT`
- `DB_NAME`
- `DB_PASSWORD`
- `PYTHONPATH`
- `PORT`

To run the smoke test, `green tests/integration/smoke.py`

TODOs
- Add custom marshmallow error messages so we don't have to do weird parsing in errors/handlers.py