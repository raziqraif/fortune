import * as React from 'react';
import { RootState } from '../redux/reducers';
import { Row } from 'react-bootstrap';
import Actions from '../redux/actions';
import { connect } from 'react-redux';
import { GameType } from '../redux/actions/Game'
import CSS from 'csstype';

export interface GameProps {
    getGame: (
        id: number
    ) => void;
    gameId?: string;
    error: string;
    game: GameType;
}

interface GameState {
    // game: object;
    // setGameErrorMessage: string;
}

const styles: { [name: string]: CSS.Properties } = {
    heading: {
        //padding: '0',
        width: '100%',
        borderBottom: 'medium solid'
    },
};

class Game extends React.Component<GameProps, GameState> {
    constructor(props: GameProps) {
        super(props);

        this.state = {
            
        }
    }

    componentDidMount() {
        const { gameId } = this.props;
        // private game - get game
        // LOOKATME - getGame and the backend expect gameId to be a number,
        // but since gameId comes from match.params, it is a string.
        // not sure how we should unify this discrepency
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
                    <h1 style={styles.heading}>Fortune</h1>
                </Row>
                <Row>
                    <h3 style={styles.heading}>{gameId ? `Private Game: ${game.data.name}` : `Global Game`}</h3>
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