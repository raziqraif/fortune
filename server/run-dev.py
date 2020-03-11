from main import create_app

if __name__ == '__main__':
    app, socketio = create_app()
    socketio.run(app, host='0.0.0.0', debug=True, port=5000)
