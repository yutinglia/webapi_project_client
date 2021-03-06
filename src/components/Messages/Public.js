import {
    ChatContainer, ConversationHeader, MainContainer, Message,
    MessageInput, MessageList
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { Box } from '@mui/material';
import React from 'react';
import Swal from 'sweetalert2';
import { EXPRESS_SERVER_URL } from "../../config";
import UserContext from '../../contexts/user';
import axios from '../../helpers/axios';

const PublicMessages = React.forwardRef((props, ref) => {

    const { socket } = props;

    const [messageInputValue, setMessageInputValue] = React.useState("");
    const [messages, setMessages] = React.useState([]);
    const { user } = React.useContext(UserContext);

    React.useEffect(() => {
        getMessages();
    }, [])

    // provide update function to messages page
    React.useImperativeHandle(ref, () => ({
        update: getMessages
    }));

    const getMessages = async () => {
        try {
            const result = await axios(`${EXPRESS_SERVER_URL}/messages/self`, { method: 'GET' })
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

        const result = await axios(`${EXPRESS_SERVER_URL}/messages/self`, {
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

        getMessages();

        socket.emit('c-updated-message');

    }

    return (
        <Box sx={{
            height: "90vh",
            position: "relative",
            display: "flex",
            flexDirection: "column"
        }}>
            <MainContainer responsive>
                <ChatContainer>
                    <ConversationHeader>
                        <ConversationHeader.Back />
                        <ConversationHeader.Content userName="Workers" />
                        {/* <ConversationHeader.Actions>
                            <IconButton color="primary" onClick={() => { getMessages() }}>
                                <ReplayIcon />
                            </IconButton>
                        </ConversationHeader.Actions> */}
                    </ConversationHeader>

                    <MessageList>

                        {
                            messages.map((message) => (
                                <Message key={message.id} model={{
                                    message: message.msg,
                                    direction: message.sender === user.id ? "outgoing" : "incoming",
                                    position: "single"
                                }}>
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
                    />
                </ChatContainer>
            </MainContainer>
        </Box>
    )
})

export default PublicMessages;