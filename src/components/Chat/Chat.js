/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-lone-blocks */
import axios from 'axios'
import { useState, useRef, useEffect } from 'react'
import { IoChatbubbleEllipses, IoSend } from 'react-icons/io5'
import { io } from 'socket.io-client'

const socket = io('http://localhost:3000', {
    withCredentials: true,
})

const Chat = ({ roomId = 'room1' }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState('')
    const [userId, setUserId] = useState(null)

    const fetchUserId = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/customer', {
                withCredentials: true,
            })

            if (response.data.success) {
                setUserId(response.data.user.id)
            } else {
                console.error('Failed to fetch user information:', response.data.message)
            }
        } catch (error) {
            console.error('Error fetching user ID:', error)
        }
    }

    useEffect(() => {
        fetchUserId()
    }, [])

    const loadMessages = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/customer/messenger/4', {
                withCredentials: true,
            })

            setMessages(response.data.message)
        } catch (error) {
            console.error('Error fetching messages:', error)
        }
    }
    useEffect(() => {
        loadMessages()
        socket.on('newMessage', (value) => {
            setMessage(...message, value)
        })

        return () => {
            socket.off('newMessage')
        }
    }, [])
    useEffect(() => {
        socket.on('receiveMessage', (data) => {
            setMessages((prevMessages) => [...prevMessages, data])
        })

        return () => {
            socket.off('receiveMessage')
        }
    }, [])
    const toggleChat = () => {
        setIsOpen(!isOpen)
        loadMessages()
    }

    const sendMessage = async () => {
        if (message.trim()) {
            const newMessage = {
                messengerContent: message, // nội dung tin nhắn
            }

            try {
                const response = await axios.post(
                    `http://localhost:8080/api/customer/messenger/4`, // Địa chỉ API của bạn
                    newMessage,
                    {
                        withCredentials: true, // Thêm thuộc tính này để gửi cookie nếu cần
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    },
                )

                if (response.status === 200) {
                    // Gửi tin nhắn đến server socket.IO để thông báo cho những client khác
                    loadMessages()
                    // socket.emit('sendMessage', newMessage)
                    // setMessages((prevMessages) => [...prevMessages, newMessage])
                    // setMessage('') // Đặt lại giá trị tin nhắn sau khi gửi thành công
                } else {
                    console.error('Error sending message:', response.status)
                }
            } catch (error) {
                console.error('Error sending message:', error)
            }
        }
    }

    const lastMessageRef = useRef(null)
    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages])
    const formatMessageTime = (messageTime) => {
        const now = new Date()
        const messageDate = new Date(messageTime)
        const diffTime = now - messageDate
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

        const options = {
            weekday: 'short', // Thứ
            hour: '2-digit',
            minute: '2-digit',
        }

        if (diffDays < 7) {
            return messageDate.toLocaleTimeString('vi-VN', options)
        } else {
            return (
                messageDate.toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                }) +
                ', ' +
                messageDate.toLocaleTimeString('vi-VN', options)
            )
        }
    }
    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div
                className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-blue-500 text-white"
                onClick={toggleChat}
            >
                <IoChatbubbleEllipses />
            </div>

            {isOpen && (
                <div className="fixed bottom-4 right-20 flex h-[56%] w-[26%] flex-col rounded-lg bg-white shadow-lg">
                    <div className="flex justify-between p-2 shadow-md">
                        <div className="flex items-center gap-2">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/9703/9703596.png"
                                alt=""
                                className="h-9 w-9 rounded-full"
                            />
                            <div className="text-base font-bold">Admin</div>
                        </div>
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none"
                            onClick={toggleChat}
                        >
                            <svg
                                className="h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="scrollbar scrollbar-thumb-blue-300 scrollbar-track-white h-full overflow-y-scroll px-2">
                        {messages.map((msg, index) => {
                            const isAdminMessage = msg.senderId === 4

                            // Determine if the current message is the last in a sequence of admin messages
                            const isLastAdminMessage =
                                isAdminMessage && (index === messages.length - 1 || messages[index + 1].senderId !== 4)

                            return (
                                <div
                                    key={index}
                                    ref={index === messages.length - 1 ? lastMessageRef : null}
                                    className={`flex ${msg.senderId !== 4 ? 'justify-end' : 'items-end justify-start'}`}
                                >
                                    {isAdminMessage && isLastAdminMessage && (
                                        <div className="flex-shrink-0">
                                            <img
                                                src="https://cdn-icons-png.flaticon.com/512/9703/9703596.png"
                                                alt="Admin Avatar"
                                                className="mr-1 h-9 w-9 rounded-full" // Margin top to add space between message and avatar
                                            />
                                        </div>
                                    )}
                                    <div
                                    // className={`${
                                    //     msg.sender === "user" ? "mr-2" : ""
                                    // }`}
                                    >
                                        <div
                                            className={`group relative inline-block max-w-48 break-words rounded-2xl p-2 text-left ${
                                                msg.senderId !== 4 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                                            } ${
                                                index > 0 && messages[index - 1].senderId !== msg.senderId
                                                    ? 'mt-3'
                                                    : 'mt-[2px]'
                                            }`}
                                            style={{
                                                marginLeft: isAdminMessage && isLastAdminMessage ? '0' : '40px',
                                            }}
                                        >
                                            {msg.messengerContent}
                                            <div
                                                className={`${
                                                    msg.senderId !== 4 ? 'right-full' : 'left-full'
                                                } mix-w-[200px] back absolute top-[0%] z-50 hidden overflow-x-auto whitespace-nowrap rounded-xl bg-stone-600 p-3 text-xs text-white group-hover:block`}
                                            >
                                                {formatMessageTime(msg.messengerTime)}
                                            </div>
                                        </div>

                                        {/* <div className="text-sm text-gray-600">
                                {new Date(msg.messageTime).toLocaleString()}
                            </div> */}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="flex items-center p-2">
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Nhập tin nhắn..."
                            className="block h-auto max-h-36 min-h-10 w-full flex-1 resize-none overflow-hidden rounded-2xl border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                            rows={1}
                            onInput={(e) => {
                                e.target.style.height = 'auto' // Reset the height
                                e.target.style.height = `${e.target.scrollHeight}px` // Set the new height based on content
                                if (e.target.scrollHeight > 144) {
                                    // Chiều cao tối đa 140px (tương ứng với 7 dòng)
                                    e.target.style.height = '144px'
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault()
                                    sendMessage()
                                }
                            }}
                        />
                        <button onClick={sendMessage} className="p-2">
                            <IoSend className="h-6 w-6 text-blue-500 hover:text-blue-700" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Chat
