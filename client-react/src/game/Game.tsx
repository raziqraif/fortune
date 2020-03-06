import * as React from 'react';
import { RootState } from '../redux/reducers';
import { Row, Container, Col } from 'react-bootstrap';
import Actions from '../redux/actions';
import { connect } from 'react-redux';

export interface GameProps {
    getGame: (
        id: number
    ) => void;
    gameId?: string;
    error: string;
    game: object;
}

interface GameState {
    // game: object;
    // setGameErrorMessage: string;
}

class Game extends React.Component<GameProps, GameState> {
    constructor(props: GameProps) {
        super(props);

        this.state = {
            
        }
    }

    componentDidMount() {
        const { gameId } = this.props;
        // private game - get game
        if (gameId) {
            this.props.getGame(parseInt(gameId));
        }
        
        // global game - get global game (TODO)
        else {

        }
    }

    render() {
        const { gameId, error, game } = this.props;
        if (error) {
            return <p style={{color: 'red'}}>{error}</p>
        }

        return (
            <div className="Game">
                <Row>
                    <h1>Fortune</h1>
                </Row>
                <Row>
                    <h3>{gameId ? `Private Game: ${gameId}` : `Global Game`}</h3>
                </Row>      
            </div>
        )
    }
}

const mapStateToProps = (state: RootState) => ({
    game: state.game.game,
    error: state.game.setGameErrorMessage,
})

const mapDispatchToProps = {
    getGame: Actions.game.getGame,
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);