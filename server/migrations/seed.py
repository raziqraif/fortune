from db import Coin


def seed():
    Coin.create(name='Bitcoin', symbol='BTC')
    Coin.create(name='Ethereum', symbol='ETH')
    Coin.create(name='Litecoin', symbol='LTC')
    Coin.create(name='Coin 3', symbol='CO3')
    Coin.create(name='Coin 4', symbol='CO4')
    Coin.create(name='Coin 5', symbol='CO5')

