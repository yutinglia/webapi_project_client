import React from 'react'
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
    Sidebar,
    Search,
    ConversationList,
    Conversation,
    Avatar,
    ConversationHeader,
    EllipsisButton,
    TypingIndicator,
    MessageSeparator
} from "@chatscope/chat-ui-kit-react";
import { Box, IconButton, Typography, Stack } from '@mui/material'
import UserContext from '../../contexts/user';
import axios from '../../helpers/axios'
import Swal from 'sweetalert2'
import { EXPRESS_SERVER_URL } from "../../config"
import ReplayIcon from '@mui/icons-material/Replay';
import MessageMenu from './Menu'

const WorkersMessages = React.forwardRef((props, ref) => {

    const { socket } = props;

    const [messageInputValue, setMessageInputValue] = React.useState("");

    const [chats, setChats] = React.useState([]);
    const [selectedChat, setSelectedChat] = React.useState(null);
    const [messages, setMessages] = React.useState([]);

    const { user } = React.useContext(UserContext);

    React.useEffect(() => {
        getChats();
    }, [])

    React.useImperativeHandle(ref, () => ({
        update: updateMessages
    }));

    const updateMessages = () => {
        getMessages();
        getChats();
    }

    const getMessages = async (user = selectedChat ? selectedChat.user : null) => {
        if (!user) return;
        try {
            const result = await axios(`${EXPRESS_SERVER_URL}/messages/${user}`, { method: 'GET' })
            const json = result.data;
            if (json.status === 0) {
                setMessages(json.messages);
            } else {
                throw new Error(json.err);
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Oops... Get Messages Failed',
                text: err,
                allowOutsideClick: false
            })
        }
    }

    const sendMessage = async () => {
        if (messageInputValue.length <= 0) return;

        const result = await axios(`${EXPRESS_SERVER_URL}/messages/${selectedChat.user}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({ msg: messageInputValue })
        })

        const json = result.data;

        setMessageInputValue("");

        if (json.status !== 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops... Failed',
                text: json.err,
                allowOutsideClick: false
            })
            return;
        }

        updateMessages();

        socket.emit('c-updated-message');

    }

    const getChats = async () => {
        const result = await axios(`${EXPRESS_SERVER_URL}/messages`, { method: 'GET' })
        const json = result.data;

        if (json.status !== 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops... Failed',
                text: json.err,
                allowOutsideClick: false
            })
            return;
        }

        setChats(json.chats);
    }

    return (
        <Box sx={{
            height: "90vh",
            position: "relative",
        }}>
            <MainContainer responsive>
                <Sidebar position="left" scrollable={true}>
                    <ConversationList>
                        {
                            chats.map(chat => (
                                <Conversation
                                    key={chat.user}
                                    name={chat.username}
                                    lastSenderName={chat.sender === user.id ? "You" : chat.sender_name}
                                    info={chat.msg}
                                    lastActivityTime={new Date(chat.last_msg_datetime).toLocaleString()}
                                    onClick={() => {
                                        setSelectedChat(chat);
                                        getMessages(chat.user);
                                    }}
                                />
                            ))
                        }
                    </ConversationList>
                </Sidebar>

                <ChatContainer>
                    <ConversationHeader>
                        <ConversationHeader.Back />
                        <ConversationHeader.Content userName={selectedChat ? selectedChat.username : "Please Select Chat"} />
                        {/* <ConversationHeader.Actions>
                            <IconButton color="primary" onClick={() => {
                                getMessages();
                                getChats();
                            }}>
                                <ReplayIcon />
                            </IconButton>
                        </ConversationHeader.Actions> */}
                    </ConversationHeader>

                    <MessageList>

                        {
                            messages.map((message) => (
                                <Message key={message.msg_datetime} model={{
                                    message: message.msg,
                                    direction: message.sender === user.id ? "outgoing" : "incoming",
                                    position: "single"
                                }}>
                                    <Message.CustomContent>
                                        <Stack
                                            justifyContent="space-between"
                                            alignItems="center"
                                            direction="row"
                                        >
                                            <Message.HtmlContent html={`${message.msg}`} />
                                            <MessageMenu updateMessages={updateMessages} id={message.id} socket={socket} />
                                        </Stack>
                                    </Message.CustomContent>
                                    <Message.Footer sender={message.sender === user.id ? "" : message.sender_name} sentTime={new Date(message.msg_datetime).toLocaleString()} />
                                </Message>
                            ))
                        }

                    </MessageList>

                    <MessageInput
                        placeholder="Type message here"
                        value={messageInputValue}
                        onChange={val => setMessageInputValue(val)}
                        attachButton={false}
                        onSend={sendMessage}
                        disabled={selectedChat ? undefined : true}
                    />
                </ChatContainer>
            </MainContainer>
        </Box>
    )
})

export default WorkersMessages;