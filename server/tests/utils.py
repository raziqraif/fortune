import os
# just in case...
os.environ['FLASK_ENV'] = 'testing'
from unittest import TestCase

from auth.decorators import require_authentication
from db import *
from main import create_app
from migrations.migrate import migrate
from notifications.services import register_socketio


class IntegrationTest(TestCase):
    @classmethod
    def setUpClass(cls):
        cls.app, socketio = create_app()
        register_socketio(socketio)
        cls.client = cls.app.test_client()

class AuthTest(TestCase):
    @classmethod
    def setUpClass(cls):
        cls.app, cls.socketio = create_app()

        @cls.app.route('/testauth')
        @require_authentication
        def testauth(profile):
            return 'authenticated'
        
        cls.client = cls.app.test_client()



class DbTest(IntegrationTest):
    @classmethod
    def setUpClass(cls):
        #super(IntegrationTest, cls).setUpClass()
        super(DbTest, cls).setUpClass()
        #IntegrationTest.setUpClass()
        #for i in range(1, 2):
        #    migrate('up', f'migrations.v{i}')
        pass
    
    @classmethod
    def tearDownClass(cls):
        # TODO migrate down/delete tables
        #for i in reversed(range(1, 2)):
        #    migrate('down', f'migrations.v{i}')
        pass

    def setUp(self):
        # TODO insert test data into DB for each test, not strictly necessary
        # though
        #db.create_tables(MODELS)
        #seed()
        for i in range(1, 2):
            migrate('up', f'migrations.v{i}')

    def tearDown(self):
        # TODO drop test data from DB after each test
        #db.drop_tables(MODELS)
        for i in reversed(range(1, 2)):
            migrate('down', f'migrations.v{i}')

    # TODO maybe have other helpers used across DB test cases


class AuthDbTest(AuthTest, DbTest):
    """
    The purpose of this class is to be the same as a DbTest, but to take
    advantage of multiple inheritance. The __mro__ will resolve AuthTest's
    setUpClass and will add our /testauth route but will still get all of the
    other features of a DbTest too
    """
    pass

