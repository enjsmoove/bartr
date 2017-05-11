import React from 'react';
import ChatListEntry from './ChatListEntry';
import { Header, Image, Modal } from 'semantic-ui-react';
import './styles/styles.css';

const ChatList = (props) => {
  return (
    <div className="chatlistentry msglist" >
      {props.messages.map((message, index) => 
        <ChatListEntry message={message} key={index} index={index}/>
      )}
    </div>
  )
}

export default ChatList;