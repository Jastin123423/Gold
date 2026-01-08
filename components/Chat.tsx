
import React, { useState, useEffect, useRef } from 'react';
import { User, Message } from '../types';
import { StickerPicker, EmojiPicker } from './Pickers';

interface ChatWindowProps {
    currentUser: User;
    recipient: User;
    messages: Message[];
    onSendMessage: (text: string, stickerUrl?: string) => void;
    onNavigateToProfile: (userId: number) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ currentUser, recipient, messages, onSendMessage, onNavigateToProfile }) => {
    const [inputText, setInputText] = useState('');
    const [showStickers, setShowStickers] = useState(false);
    const [showEmojis, setShowEmojis] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };
    useEffect(() => { scrollToBottom(); }, [messages, showStickers, showEmojis]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputText.trim()) {
            onSendMessage(inputText);
            setInputText('');
            setShowEmojis(false);
            setShowStickers(false);
        }
    };

    const handleStickerSelect = (url: string) => {
        onSendMessage('', url);
        setShowStickers(false);
    };

    const handleEmojiSelect = (emoji: string) => {
        setInputText(prev => prev + emoji);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            onSendMessage(`Sent a file: ${file.name}`);
        }
    };

    const isOnlyEmojis = (text: string) => {
        if (!text) return false;
        const emojiRegex = /^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F){1,3}$/u;
        return emojiRegex.test(text.trim());
    };

    return (
        <div className="flex flex-col h-full bg-[#18191A]">
            {/* Header - Facebook Messenger Style */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-[#3E4042] h-16 flex-shrink-0">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigateToProfile(recipient.id)}>
                    <div className="relative">
                        <img src={recipient.profileImage} alt={recipient.name} className="w-10 h-10 rounded-full object-cover" />
                        {recipient.isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#31A24C] rounded-full border-2 border-[#242526]"></div>}
                    </div>
                    <div>
                        <h4 className="font-bold text-[16px] text-[#E4E6EB] leading-tight">{recipient.name}</h4>
                        <span className="text-[12px] text-[#B0B3B8] block leading-tight">{recipient.isOnline ? 'Active now' : 'Offline'}</span>
                    </div>
                </div>
                <div className="flex items-center gap-5 text-[#1877F2]">
                    <i className="fas fa-phone-alt cursor-pointer text-xl hover:text-blue-400 transition-colors"></i>
                    <i className="fas fa-video cursor-pointer text-xl hover:text-blue-400 transition-colors"></i>
                    <i className="fas fa-info-circle cursor-pointer text-xl hover:text-blue-400 transition-colors"></i>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-1">
                {messages.map((msg, index) => {
                    const isMe = msg.senderId === currentUser.id;
                    const bigEmoji = isOnlyEmojis(msg.text);
                    const showAvatar = !isMe && (index === messages.length - 1 || messages[index + 1]?.senderId !== msg.senderId);

                    return (
                        <div key={msg.id} className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                            {showAvatar && (
                                <img src={recipient.profileImage} className="w-7 h-7 rounded-full object-cover self-end" alt="" />
                            )}
                            {msg.stickerUrl ? (
                                <img src={msg.stickerUrl} alt="sticker" className="w-32 h-32 object-contain" />
                            ) : (
                                <div className={`max-w-[65%] px-3 py-2 rounded-2xl ${isMe ? 'bg-[#1877F2] text-white' : 'bg-[#3A3B3C] text-[#E4E6EB]'} ${bigEmoji ? '!bg-transparent p-0' : ''} ${!showAvatar && !isMe ? 'ml-9' : ''}`}>
                                    {bigEmoji ? <span className="text-5xl">{msg.text}</span> : <span>{msg.text}</span>}
                                </div>
                            )}
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Pickers Area */}
            {showStickers && <StickerPicker onSelect={handleStickerSelect} />}
            {showEmojis && <EmojiPicker onSelect={handleEmojiSelect} />}

            {/* Footer Input */}
            <div className="p-3 border-t border-[#3E4042] flex items-center gap-2">
                <div className="flex gap-2">
                    <i className="fas fa-plus-circle text-[#1877F2] text-2xl cursor-pointer hover:text-blue-400" onClick={() => fileInputRef.current?.click()}></i>
                    <i className={`fas fa-sticky-note text-2xl cursor-pointer ${showStickers ? 'text-[#1877F2]' : 'text-[#B0B3B8]'}`} onClick={() => { setShowStickers(!showStickers); setShowEmojis(false); }}></i>
                </div>
                <form className="flex-1 bg-[#3A3B3C] rounded-full flex items-center" onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        value={inputText} 
                        onChange={(e) => setInputText(e.target.value)} 
                        onFocus={() => { setShowStickers(false); setShowEmojis(false); }}
                        placeholder="Aa" 
                        className="w-full bg-transparent px-4 py-2 text-[15px] outline-none text-[#E4E6EB] placeholder-[#B0B3B8]" 
                    />
                    <i className={`far fa-smile text-xl cursor-pointer mr-3 ${showEmojis ? 'text-[#1877F2]' : 'text-[#B0B3B8]'}`} onClick={() => { setShowEmojis(!showEmojis); setShowStickers(false); }}></i>
                </form>
                <button type="submit" onClick={handleSubmit} className="text-[#1877F2] hover:text-blue-400 p-2 rounded-full">
                    <i className="fas fa-paper-plane text-2xl"></i>
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*,application/pdf" onChange={handleFileChange} />
            </div>
        </div>
    );
};
