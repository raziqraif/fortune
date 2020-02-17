import peewee


class BaseModel(peewee.Model):
    class Meta:
        # TODO put the database here
        database = None

