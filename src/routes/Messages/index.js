import React from 'react';
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import PublicMessagesPage from '../../components/Messages/Public';
import WorkerMessagesPage from '../../components/Messages/Worker';
import { EXPRESS_SERVER_URL } from "../../config";
import UserContext from '../../contexts/user';

export default function MessagesPage() {

    const { user } = React.useContext(UserContext);
    const [socket, setSocket] = React.useState(null);

    const childRef = React.useRef();

    let navigate = useNavigate();

    React.useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user])

    React.useEffect(() => {
        // connect to server with socket.io for chat
        const socket = io(EXPRESS_SERVER_URL, {
            auth: {
                token: localStorage.getItem('token')
            }
        });
        socket.on("s-updated-message", () => {
            childRef.current.update();
        })
        setSocket(socket);
        // disconnect when exit this page
        return (() => {
            socket.off();
            socket.disconnect();
            setSocket(null);
        })
    }, [])

    if (user && user.type <= 2) {
        if (user.type === 2) {
            return <PublicMessagesPage socket={socket} ref={childRef} />
        } else {
            return <WorkerMessagesPage socket={socket} ref={childRef} />
        }
    } else {
        return <div></div>
    }

}
