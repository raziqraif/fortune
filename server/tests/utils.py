import os
# just in case...
os.environ['FLASK_ENV'] = 'testing'
from unittest import TestCase

from db import *
from main import create_app


class IntegrationTest(TestCase):
    @classmethod
    def setUpClass(cls):
        cls.app = create_app()
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

