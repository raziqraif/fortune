from main import create_app

if __name__ == '__main__':
    app, socketio_app = create_app()
    socketio_app.run(app, host='0.0.0.0', debug=True, port=5000)
