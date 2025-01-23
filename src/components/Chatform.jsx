import React, { useRef } from 'react'

function Chatform({ inputRef, handleformSubmit }) {
    return (
        <form action="#" className="chat-form" onSubmit={handleformSubmit}>
            <input ref={inputRef} placeholder='Message...' type="text" className="message-input" required />
            <button className="material-symbols-rounded">
                keyboard_arrow_up
            </button>
        </form>
    )
}

export default Chatform