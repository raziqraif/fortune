import os
# just in case...
os.environ['FLASK_ENV'] = 'testing'
from unittest import TestCase

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
        raise NotImplementedError
    
    @classmethod
    def tearDownClass(cls):
        # TODO migrate down/delete tables
        raise NotImplementedError

    def setUp(self):
        # TODO insert test data into DB for each test, not strictly necessary
        # though
        raise NotImplementedError

    def tearDown(self):
        # TODO drop test data from DB after each test
        raise NotImplementedError

    # TODO maybe have other helpers used across DB test cases

