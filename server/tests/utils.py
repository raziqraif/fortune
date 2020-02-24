import os
# just in case...
os.environ['FLASK_ENV'] = 'testing'
from unittest import TestCase

from auth.decorators import require_authentication
from db import *
from main import create_app


class IntegrationTest(TestCase):
    @classmethod
    def setUpClass(cls):
        cls.app = create_app()
        cls.client = cls.app.test_client()


class AuthTest(TestCase):
    @classmethod
    def setUpClass(cls):
        cls.app = create_app()

        @cls.app.route('/testauth')
        @require_authentication
        def testauth(profile):
            return 'authenticated'
        
        cls.client = cls.app.test_client()



class DbTest(IntegrationTest):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        # TODO connect to to test database,
        # migrate tables
        # db.create_tables() <<-- we already do this in main.py
    
    @classmethod
    def tearDownClass(cls):
        # TODO migrate down/delete tables
        db.drop_tables([Profile, AuthToken, Game, GameProfile, Coin, GameCoin,
            Ticker, Trade, GameProfileCoin])

    def setUp(self):
        # TODO insert test data into DB for each test, not strictly necessary
        # though
        pass

    def tearDown(self):
        # TODO drop test data from DB after each test
        pass

    # TODO maybe have other helpers used across DB test cases


class AuthDbTest(AuthTest, DbTest):
    """
    The purpose of this class is to be the same as a DbTest, but to take
    advantage of multiple inheritance. The __mro__ will resolve AuthTest's
    setUpClass and will add our /testauth route but will still get all of the
    other features of a DbTest too
    """
    pass

