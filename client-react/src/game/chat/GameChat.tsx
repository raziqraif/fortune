import React from 'react';
import { MessageBox } from 'react-chat-elements';   // Still no typescript
import {Launcher} from 'react-chat-window'  // No typescript
import { ThemeProvider } from '@livechat/ui-kit' // Don't have typescript declaration
// UI and Documentation for this is good tho T-T

export interface ChatProps {
    test?: boolean
}

export default class GameChat extends React.Component<ChatProps>{

    render() {
        return (
            <Launcher>

            </Launcher>
        )
    }
}
