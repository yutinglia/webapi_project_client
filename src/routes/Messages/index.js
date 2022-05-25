import React from 'react'
import PublicMessagesPage from '../../components/Messages/Public'
import WorkerMessagesPage from '../../components/Messages/Worker'
import UserContext from '../../contexts/user';

export default function MessagesPage() {
    const { user } = React.useContext(UserContext);

    if (user && user.type <= 2) {
        if (user.type === 2) {
            return <PublicMessagesPage />
        } else {
            return <WorkerMessagesPage />
        }
    } else {
        return <div></div>
    }
}
