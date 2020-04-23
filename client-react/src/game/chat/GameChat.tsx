import React from 'react';
import './GameChat.css'
import {ChatFeed, Message, Author, ChatBubbleProps, ChatFeedApi, ChatBubble} from 'react-bell-chat';

import {ChatFeedStyles} from "react-bell-chat/src/lib/ChatFeed";
import {ChatScrollAreaStyles} from "react-bell-chat/src/lib/ChatScrollArea";
import {ChatBubbleStyles} from "react-bell-chat/src/lib/ChatBubble/styles";
import {RootState} from "../../redux/reducers";
import Actions from "../../redux/actions";
import {connect} from "react-redux";

// const styles: { [key: string]: React.CSSProperties } = {
//     button: {
//         backgroundColor: '#fff',
//         borderColor: '#1D2129',
//         borderStyle: 'solid',
//         borderRadius: 20,
//         borderWidth: 2,
//         color: '#1D2129',
//         fontSize: 18,
//         fontWeight: 300,
//         paddingTop: 8,
//         paddingBottom: 8,
//         paddingLeft: 16,
//         paddingRight: 16,
//     },
//     selected: {
//         color: '#fff',
//         backgroundColor: '#0084FF',
//         borderColor: '#0084FF',
//     },
// };

const chatBubbleStyles: ChatBubbleStyles = {
    // TODO: Update this to make sure text is wrapped properly in the chat bubbles
};

const chatFeedStyles: ChatFeedStyles = {
    chatPanel: {
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        border: 'thin solid black',
    },
    showRecipientAvatarChatMessages: {
        paddingLeft: 50
    },
    showIsTypingChatMessages: {
        paddingBottom: 24,
        position: 'relative'
    },
    showRecipientLastSeenMessageChatMessages: {
        paddingRight: 30
    },
    chatMessages: {
        paddingBottom: 10,
        paddingTop: 10,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end'
    }
};

const chatScrollAreaStyles: ChatScrollAreaStyles = {
    container: {
        // overflow: 'auto',
        // padding: '0 10px 15px 15px',
        paddingLeft: '20px',
        paddingRight: '20px',
        display: 'flex',
        flexDirection: 'column',
        height: '50rem',
        maxHeight: '60rem',
        width: '22rem',
        border: "thin solid grey",
        borderRadius: 5,
        // flexDirection: 'column-reverse'
    }
};

interface GameChatProps {
    gameID: number,
    messages: Message[],
    hasOlderMessages: boolean,
    players: Author[],
    currentPlayerID: number,
    createMessage: (gameID: number, message: string) => void,
    getMessagesData: (gameID: number, oldestID: number, newestID: number, getNewMessages: boolean) => void,
    getPlayersData: (gameID: number) => void,
}

interface GameChatState {
    messageText: string;
    showLoading: boolean;
}

class GameChat extends React.Component<GameChatProps, GameChatState> {
    private chat: ChatFeedApi;
    gameID = this.props.gameID;

    constructor(props: GameChatProps) {
        super(props);

        // NOTE: I couldn't really comprehend how to implement this from the docs. Couldn't find any demo, so this is a
        // dummy.
        this.chat = {
            onMessageSend: ()=>{},
            scrollApi: {
                scrolledToBottom: ()=> true,
                scrollTo: (a:number)=> {console.log("chat api:", a)},
                scrolledToLoadThreshold: () => true,
                scrollHeight: () => {return 1;},
                scrollToBottom: ()=>{},
                scrollTop: ()=>{return 1;},
                clientHeight: ()=>{return 1;},
            }
        };

        // TODO: Handle newly-registered authors, if given time
        this.state = {
            messageText: '',
            showLoading: false,
        };
    }

    componentDidMount(): void {
        this.props.getPlayersData(this.gameID);
        // @ts-ignore
        this.props.getMessagesData(this.gameID, this.oldestMessageID(), this.newestMessageID(), true);
    }

    newestMessageID() {
        if (!this.props.messages) {
            return -1;
        }

        let len = this.props.messages.length;
        if (len == 0) {
            return -1;
        }
        return this.props.messages[len - 1].id;
    }

    oldestMessageID() {
        if (!this.props.messages) {
            return -1;
        }

        let len = this.props.messages.length;
        if (len == 0) {
            return -1;
        }
        return this.props.messages[0].id;
    }

    onMessageSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (this.state.messageText !== '') {
            this.props.createMessage(this.gameID, this.state.messageText);
            this.setState(previousState => ({
                messageText: '',
            }), () => this.chat && this.chat.onMessageSend());
        }
        // @ts-ignore
        // TODO: Remove these after implementing websocket
        this.props.getMessagesData(this.gameID, this.oldestMessageID(), this.newestMessageID(), true);
        this.props.getPlayersData(this.gameID)
        return true;
    }

    customBubble = (props: ChatBubbleProps) => {
        // LOOKATME: Do not remove this comment in case we want to switch to terminal-style chat messages.
        // return <div>
        //     {/*<p>{props.author && props.author.name + ' ' + (props.message.authorId !== props.yourAuthorId ? 'says' : 'said') + ': ' + props.message.message}</p>*/}
        //     <p>{props.author && (props.message.authorId !== props.yourAuthorId ? '' : '     ') +  props.message.message}</p>
        // </div>
        // if (props.author) {
        return (
            <ChatBubble
                message={props.message}
                author={props.author}
                yourAuthorId={this.props.currentPlayerID}
                styles={{
                    ...props.styles,
                    text: {
                        color: '#FFFFFF',
                        fontSize: 16,
                        fontWeight: 300,
                        margin: 0,
                        marginRight: 30,
                        whiteSpace: 'pre',
                        overflowWrap: 'break-word',
                        width: "100%",
                    } as React.CSSProperties,
                }}
            />
        //    TODO: Return a button too for report feature
        )
        // }
    };

    render() {
        return (
            <div className="chatfeed-wrapper">
                <h2 style={{margin: "0px 0px 15px", }}>Chat</h2>
                <ChatFeed
                    styles={chatFeedStyles}
                    chatScrollArea={chatScrollAreaStyles}
                    yourAuthorId={this.props.currentPlayerID}
                    authors={this.props.players}
                    customChatBubble={this.customBubble}
                    chatBubbleStyles={chatBubbleStyles}
                    messages={this.props.messages}
                    showRecipientAvatar={true}
                    ref={(e:any) => this.chat = e}
                    showIsTyping={false}
                    showRecipientLastSeenMessage={false}
                    showDateRow={false}
                    showLoadingMessages={false}
                    hasOldMessages={this.props.hasOlderMessages}
                    // NOTE: This is from demo
                    // onLoadOldMessages={() => new Promise(resolve => setTimeout(() => {
                    //     this.setState(previousState => ({
                    //         messages: (
                    //             new Array(10).fill(1)).map((e, i) => ({
                    //                 id: Number(new Date()),
                    //                 createdOn: new Date(2017, 1, 1),
                    //                 message: 'Old message ' + (i + 1).toString(),
                    //                 authorId: Math.round(Math.random() + 1)
                    //        } as Message)).concat(previousState.messages)
                    //    }), () => resolve());
                    // }, 1000))}

                    // NOTE: Not working
                    // onLoadOldMessages={() => new Promise(resolve => setTimeout(() => {
                        // @ts-ignore
                        // this.props.getMessagesData(this.gameID, this.oldestMessageID(), this.newestMessageID(),
                        //     false)
                        // this.setState({showLoading: false})
                    //}, 1000))}
                />

                <form
                    style={{width: "100%", paddingBottom: 80}}
                    onSubmit={e => this.onMessageSubmit(e)}>
                    <input
                        style={{
                            height: "50px",
                            width: "100%",
                            border: "none",
                            borderBottom: "1px solid black",
                            outlineWidth: 0,
                        }}
                        placeholder="Type a message..."
                        className="message-input"
                        value={this.state.messageText}
                        onChange={e => this.setState({ messageText: e.target.value })}
                    />
                </form>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    players: state.game.players,
    currentPlayerID: state.game.currentPlayerID,
    messages: state.game.messages,
    hasOlderMessages: state.game.hasOlderMessages,
});

const mapDispatchToProps = {
    getPlayersData: Actions.game.getPlayersData,
    getMessagesData: Actions.game.getMessagesData,
    createMessage: Actions.game.createMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(GameChat);
