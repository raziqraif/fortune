import * as React from 'react';

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