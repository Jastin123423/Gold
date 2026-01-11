
import React, { useState, useEffect, useRef } from 'react';
import { Story, User } from '../types';
import { INITIAL_USERS } from '../constants';

interface StoryViewerProps {
    story: Story;
    user: User;
    currentUser: User | null;
    onClose: () => void;
    onNext?: () => void;
    onPrev?: () => void;
    onReply?: (text: string) => void;
    onLike?: () => void;
    onFollow?: (id: number) => void;
    isFollowing?: boolean;
    allStories?: Story[];
}

export const StoryViewer: React.FC<StoryViewerProps> = ({ 
    story, user, currentUser, onClose, onNext, onPrev, onReply, onLike, onFollow, isFollowing, allStories = [] 
}) => {
    const [progress, setProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [showHeartAnim, setShowHeartAnim] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const isGuest = !currentUser;

    const userStories = allStories.filter(s => s.userId === story.userId);
    const currentIndex = userStories.findIndex(s => s.id === story.id);
    
    useEffect(() => {
        let duration = 5000; 
        setProgress(0);
        const timer = setInterval(() => {
            if (!isPaused) {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(timer);
                        if (onNext) onNext();
                        return 100;
                    }
                    const increment = 100 / (duration / 50); 
                    return Math.min(100, prev + increment);
                });
            }
        }, 50); 
        return () => clearInterval(timer);
    }, [story.id, onNext, isPaused]);

    const handleSendReply = () => {
        if (isGuest) return;
        if (replyText.trim() && onReply) {
            onReply(replyText);
            setReplyText('');
            setIsPaused(false);
        }
    };

    const handleLike = () => {
        if (isGuest) return;
        if (onLike) {
            onLike();
            setShowHeartAnim(true);
            setTimeout(() => setShowHeartAnim(false), 800);
        }
    };

    return (
        <div className="fixed inset-0 z-[250] bg-black flex items-center justify-center animate-fade-in">
            <div className="absolute top-4 right-4 z-[300] cursor-pointer w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors" onClick={onClose}>
                <i className="fas fa-times text-[#E4E6EB] text-2xl"></i>
            </div>

            <div className="relative w-full max-w-[420px] h-full sm:h-[92vh] bg-black sm:rounded-2xl overflow-hidden flex flex-col shadow-2xl">
                <div className="absolute top-0 left-0 right-0 p-3 z-30 flex gap-1.5">
                    {userStories.map((_, i) => (
                        <div key={i} className="h-1 bg-white/20 flex-1 rounded-full overflow-hidden">
                            <div className="h-full bg-white transition-all duration-75" style={{ width: i < currentIndex ? '100%' : i === currentIndex ? `${progress}%` : '0%' }} />
                        </div>
                    ))}
                </div>

                <div className="absolute top-4 left-0 right-0 p-4 z-30 flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3">
                        <img src={user.profileImage} alt={user.name} className="w-12 h-12 rounded-full border-2 border-[#1877F2] object-cover" />
                        <div className="flex flex-col">
                            <span className="text-white font-bold text-[17px]">{user.name}</span>
                            {!isFollowing && !isGuest && onFollow && (
                                <button onClick={(e) => { e.stopPropagation(); onFollow(user.id); }} className="bg-[#1877F2] text-white text-[12px] font-black px-4 py-1 rounded-full">Follow</button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="absolute inset-y-0 left-0 w-1/4 z-10" onClick={onPrev}></div>
                <div className="absolute inset-y-0 right-0 w-1/4 z-10" onClick={onNext}></div>
                
                <div className="flex-1 flex items-center justify-center bg-[#111] relative" onDoubleClick={handleLike}>
                    {story.type === 'text' ? (
                        <div className="w-full h-full flex items-center justify-center p-10 text-center" style={{ background: story.background }}>
                            <span className="text-white font-bold text-4xl whitespace-pre-wrap">{story.text}</span>
                        </div>
                    ) : (
                        <img src={story.image} alt="Story" className="w-full h-full object-cover" />
                    )}
                    {showHeartAnim && <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none"><i className="fas fa-heart text-white text-9xl animate-pop-heart"></i></div>}
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20 flex items-center gap-3 bg-gradient-to-t from-black/80 to-transparent pt-12">
                    <div className="flex-1 flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-3.5">
                        <input 
                            ref={inputRef} type="text" 
                            placeholder={isGuest ? "Log in to reply" : "Send a message..."} 
                            className="bg-transparent text-white placeholder-white/60 outline-none w-full text-[16px]" 
                            value={replyText} 
                            onChange={(e) => setReplyText(e.target.value)} 
                            onFocus={() => setIsPaused(true)} 
                            onBlur={() => { if(!replyText) setIsPaused(false); }} 
                            onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                            disabled={isGuest}
                        />
                    </div>
                    <div onClick={handleLike} className={`w-12 h-12 flex items-center justify-center cursor-pointer transition-transform ${isGuest ? 'opacity-50' : 'active:scale-125'}`}>
                        <i className={`fas fa-heart text-white/80 text-3xl`}></i>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const StoryReel: React.FC<{ stories: Story[], onProfileClick: (id: number) => void, onCreateStory?: () => void, onViewStory: (story: Story) => void, currentUser: User | null, onRequestLogin: () => void }> = ({ stories, onProfileClick, onViewStory, currentUser, onRequestLogin }) => {
    const uniqueUserStories: Story[] = Array.from(new Map<number, Story>(stories.map(s => [s.userId, s])).values());

    return (
        <div className="w-full flex gap-2.5 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            <div className="min-w-[110px] sm:min-w-[140px] h-[210px] sm:h-[250px] bg-[#242526] rounded-2xl shadow-md overflow-hidden cursor-pointer relative group flex-shrink-0 border border-[#3E4042]" onClick={() => !currentUser ? onRequestLogin() : null}>
                <img src={currentUser?.profileImage || INITIAL_USERS[0].profileImage} alt="Create" className="h-[75%] w-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80" />
                <div className="absolute bottom-0 w-full h-[25%] bg-[#242526] flex flex-col items-center justify-end pb-3">
                    <div className="absolute -top-5 w-10 h-10 bg-[#1877F2] rounded-full flex items-center justify-center border-4 border-[#242526] text-white">
                        <i className="fas fa-plus text-lg"></i>
                    </div>
                    <span className="text-xs font-bold text-[#E4E6EB] mt-4">Create Story</span>
                </div>
            </div>

            {uniqueUserStories.map((story) => (
                <div key={story.id} className="min-w-[110px] sm:min-w-[140px] h-[210px] sm:h-[250px] relative rounded-2xl overflow-hidden cursor-pointer flex-shrink-0 group shadow-lg border border-white/10" onClick={() => onViewStory(story)}>
                    {story.type === 'text' ? (
                        <div className="absolute w-full h-full flex items-center justify-center p-3 text-center" style={{ background: story.background }}>
                            <span className="text-white font-bold text-[10px] line-clamp-4 leading-tight">{story.text}</span>
                        </div>
                    ) : (
                        <img src={story.image} alt="Story" className="absolute w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    )}
                    <div className="absolute top-3 left-3 w-9 h-9 rounded-full border-4 border-[#1877F2] overflow-hidden z-10 shadow-md" onClick={(e) => { e.stopPropagation(); onProfileClick(story.userId); }}>
                        <img src={story.user?.profileImage} alt="" className="w-full h-full object-cover" />
                    </div>
                    <p className="absolute bottom-3 left-3 text-white font-bold text-xs truncate w-[85%]">{story.user?.name}</p>
                </div>
            ))}
        </div>
    );
};
