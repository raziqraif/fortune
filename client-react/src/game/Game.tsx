import * as React from 'react';
import * as H from 'history';

export interface GameProps {
    gameId?: string;
}

export default class Game extends React.Component<GameProps> {
    render() {
        const gameId = this.props.gameId;
        return (
            <div>{gameId ? `Private: ${gameId}` : `Global`}</div>
        )
    }
}