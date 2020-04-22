import React from 'react';
import './GameChat.css'
import {ChatFeed, Message, Author, ChatBubbleProps, ChatFeedApi, ChatBubble} from 'react-bell-chat';

import {ChatFeedStyles} from "react-bell-chat/src/lib/ChatFeed";
import {ChatScrollAreaStyles} from "react-bell-chat/src/lib/ChatScrollArea";
import {ChatBubbleStyles} from "react-bell-chat/src/lib/ChatBubble/styles";
import {RootState} from "../../redux/reducers";
import Actions from "../../redux/actions";
import {connect} from "react-redux";

const styles: { [key: string]: React.CSSProperties } = {
    button: {
        backgroundColor: '#fff',
        borderColor: '#1D2129',
        borderStyle: 'solid',
        borderRadius: 20,
        borderWidth: 2,
        color: '#1D2129',
        fontSize: 18,
        fontWeight: 300,
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 16,
        paddingRight: 16,
    },
    selected: {
        color: '#fff',
        backgroundColor: '#0084FF',
        borderColor: '#0084FF',
    },
};

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
}

class GameChat extends React.Component<GameChatProps, GameChatState> {
    private chat: ChatFeedApi;
    gameID = this.props.gameID;

    // getPlayersData() {
    //     // TODO: Use real API
    //     return {
    //         players: [
    //             {
    //                 id: 0,
    //                 name: 'You',
    //             },
    //             {
    //                 id: 1,
    //                 name: 'Mark',
    //             },
    //             {
    //                 id: 2,
    //                 name: 'Evan',
    //             }],
    //         currentPlayerID: 0,
    //     }
    // }

    // getMessagesData() {
    //      // TODO: Use real API
    //      return {
    //          messages: [
    //              {
    //                  id: 0,
    //                  authorId: 1,
    //                  message: 'Hey guys!!',
    //                  createdOn: new Date(2018, 2, 27, 18, 32, 24),
    //              },
    //              {
    //                  id: 3,
    //                  authorId: 2,
    //                  message: 'Long group.',
    //                  createdOn: new Date(2018, 2, 28, 18, 13, 24),
    //             },
    //             {
    //                 id: 4,
    //                 authorId: 0,
    //                 message: 'My message.',
    //                 createdOn: new Date(2018, 2, 29, 19, 32, 24),
    //             },
    //             {
    //                 id: 5,
    //                 authorId: 0,
    //                 message: 'One more.',
    //                 createdOn: new Date(2018, 2, 29, 19, 33, 24),
    //             },
    //             {
    //                 id: 6,
    //                 authorId: 2,
    //                 message: 'One more group to see the scroll.',
    //                 createdOn: new Date(2018, 2, 29, 19, 35, 24),
    //             },
    //             {
    //                 id: 7,
    //                 authorId: 2,
    //                 message: 'I said group.',
    //                 createdOn: new Date(2018, 2, 29, 19, 35, 24),
    //             },
    //         ],
    //         hasOlderMessages: true
    //     }
    // }

    constructor(props: GameChatProps) {
        super(props);
        // TODO: What's thissss??
        this.chat = {
            onMessageSend: ()=>{},
            scrollApi: {
                scrolledToBottom: ()=> true,
                scrollTo: (a:number)=> {},
                scrolledToLoadThreshold: () => true,
                scrollHeight: () => {return 100000;},
                scrollToBottom: ()=>{},
                scrollTop: ()=>{return 1000000;},
                clientHeight: ()=>{return 1000000;},
            }
        };

        // TODO: Handle newly-registered authors, if given time
        this.state = {
            messageText: '',
        };
    }

    componentDidMount(): void {
        this.props.getPlayersData(this.gameID);
        this.props.getMessagesData(this.gameID, -1, -1, true);
    }

    onMessageSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (this.state.messageText !== '') {
            this.props.createMessage(this.gameID, this.state.messageText);
            this.setState(previousState => ({
                messageText: '',
            }), () => this.chat && this.chat.onMessageSend());
            // setTimeout(() => {
                // this.setState(previousState => ({ messages: previousState.messages.map(m => m.id === id ? { ...m, isSend: true } : m) }));
            // }, 2000);
        }
        this.props.getMessagesData(this.gameID, -1, -1, true)
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
        )
        // }
    };

    updateEarlierMessages(resolve: any) {
        // TODO: Call get messages API
        // Combine messages
        // Slice messages after threshold
        // Get earliest id

        // this.setState(previousState => ({
        //     messages: (
        //         new Array(10).fill(1)).map((e, i) => ({
        //             id: Number(new Date()),
        //             createdOn: new Date(2017, 1, 1),
        //             message: 'Old message ' + (i + 1).toString(),
        //             authorId: Math.round(Math.random() + 1)
        //    } as Message)).concat(previousState.messages)
       // }), () => resolve());
    }

    render() {
        console.log("New authors:", this.props.players)
        return (
            <div className="chatfeed-wrapper">
                <h2 style={{margin: "0px 0px 15px", }}>Chat</h2>
                <ChatFeed
                    styles={chatFeedStyles}
                    chatScrollArea={chatScrollAreaStyles}
                    yourAuthorId={this.props.currentPlayerID}
                    authors={this.props.players}
                    customChatBubble={this.customBubble}
                    chatBubbleStyles={styles}
                    messages={this.props.messages}
                    showRecipientAvatar={true}
                    ref={(e:any) => this.chat = e}
                    showIsTyping={false}
                    showRecipientLastSeenMessage={false}
                    showDateRow={true}
                    showLoadingMessages={false}
                    hasOldMessages={this.props.hasOlderMessages}
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
                    // onLoadOldMessages={() => new Promise(resolve => setTimeout(() => {
                        // this.props.getMessagesData()
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
