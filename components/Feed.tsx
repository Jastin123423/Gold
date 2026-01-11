
import React, { useState, useRef } from 'react';
import { User, Post as PostType, ReactionType, Product, LinkPreview, Brand } from '../types';
import { REACTION_ICONS } from '../constants';
import { GoogleGenAI } from "@google/genai";

const RichText = ({ text, onProfileClick }: { text: string, onProfileClick: (id: number) => void }) => {
    if (!text) return null;
    return <span className="text-[18px] leading-relaxed text-[#E4E6EB] whitespace-pre-wrap">{text}</span>;
};

export const ReactionButton: React.FC<{ 
    currentUserReactions?: string, 
    reactionCount: number, 
    onReact: (t: ReactionType) => void, 
    isGuest?: boolean 
}> = ({ currentUserReactions, reactionCount, onReact, isGuest }) => {
    return (
        <div className="relative group/react flex items-center justify-center">
            <button 
                className={`text-2xl transition-transform active:scale-125 ${currentUserReactions ? 'text-[#1877F2]' : 'text-white'}`}
                onClick={() => onReact('like')}
            >
                <i className={`${currentUserReactions ? 'fas' : 'far'} fa-thumbs-up`}></i>
            </button>
            {!isGuest && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/react:flex bg-[#242526] border border-[#3E4042] rounded-full p-1 shadow-xl animate-bounce-in gap-1 z-[100]">
                    {Object.entries(REACTION_ICONS).map(([type, icon]) => (
                        <span 
                            key={type} 
                            className="text-2xl cursor-pointer hover:scale-125 transition-transform p-1"
                            onClick={() => onReact(type as ReactionType)}
                        >
                            {icon}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export const Post: React.FC<{ 
    post: PostType, 
    author: User | Brand, 
    currentUser: User | null, 
    users: User[], 
    onProfileClick: (id: number) => void, 
    onReact: (id: number, t: ReactionType) => void, 
    onShare: (id: number) => void, 
    onViewImage: (u: string) => void, 
    onOpenComments: (id: number) => void, 
    onViewProduct: (p: Product) => void 
}> = ({ post, author, currentUser, onProfileClick, onReact, onOpenComments }) => {
    const myReaction = currentUser ? post.reactions.find(r => r.userId === currentUser.id)?.type : undefined;

    return (
        <div className="bg-[#242526] rounded-xl shadow-sm mb-4 border border-[#3E4042] overflow-hidden animate-fade-in">
            <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => onProfileClick(author.id)}>
                    <img src={'profileImage' in author ? author.profileImage : ''} className="w-10 h-10 rounded-full object-cover border border-[#3E4042]" alt="" />
                    <div><h4 className="font-bold text-[#E4E6EB] hover:underline">{author.name}</h4><span className="text-[#B0B3B8] text-xs">{post.timestamp}</span></div>
                </div>
            </div>
            {post.content && <div className="px-4 pb-2"><RichText text={post.content} onProfileClick={onProfileClick} /></div>}
            {post.image && <img src={post.image} className="w-full" alt="" />}
            
            <div className="px-4 py-2 flex justify-between text-[#B0B3B8] text-sm border-b border-[#3E4042]">
                <div className="flex items-center gap-2">
                     <span className="flex -space-x-1">
                        {/* Fix: Explicitly type the Set to avoid 'unknown' type inference which causes indexing errors with REACTION_ICONS */}
                        {Array.from(new Set<string>(post.reactions.map(r => r.type))).slice(0,3).map(type => <span key={type}>{REACTION_ICONS[type]}</span>)}
                     </span>
                     <span>{post.reactions.length}</span>
                </div>
                <span className="hover:underline cursor-pointer" onClick={() => onOpenComments(post.id)}>{post.comments.length} Comments</span>
            </div>
            
            <div className="p-1 flex">
                <button 
                    onClick={() => onReact(post.id, 'like')} 
                    className={`flex-1 flex items-center justify-center gap-2 h-10 rounded hover:bg-[#3A3B3C] transition-colors ${myReaction ? 'text-[#1877F2]' : 'text-[#B0B3B8]'}`}
                >
                    <i className={`${myReaction ? 'fas' : 'far'} fa-thumbs-up`}></i>
                    <span className="font-medium">Like</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 h-10 rounded hover:bg-[#3A3B3C] text-[#B0B3B8]" onClick={() => onOpenComments(post.id)}>
                    <i className="far fa-comment-alt"></i><span className="font-medium">Comment</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 h-10 rounded hover:bg-[#3A3B3C] text-[#B0B3B8]" onClick={() => alert("Login to share")}>
                    <i className="fas fa-share"></i><span className="font-medium">Share</span>
                </button>
            </div>
        </div>
    );
};

export const CommentsSheet: React.FC<{
    post: PostType,
    currentUser: User | null,
    users: User[],
    onClose: () => void,
    onComment: (postId: number, text: string) => void,
    onLikeComment: (commentId: number) => void,
    getCommentAuthor: (id: number) => User | undefined,
    onProfileClick: (id: number) => void
}> = ({ post, currentUser, onClose, onComment, getCommentAuthor, onProfileClick }) => {
    const [text, setText] = useState('');
    const isGuest = !currentUser;

    return (
        <div className="fixed inset-0 z-[200] bg-black/60 flex items-end justify-center animate-fade-in" onClick={onClose}>
            <div className="bg-[#242526] w-full max-w-[600px] h-[80vh] rounded-t-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-[#3E4042] flex justify-between items-center">
                    <h3 className="text-xl font-bold text-[#E4E6EB]">Comments</h3>
                    <div onClick={onClose} className="w-8 h-8 rounded-full bg-[#3A3B3C] flex items-center justify-center cursor-pointer transition-colors hover:bg-[#4E4F50]"><i className="fas fa-times text-[#B0B3B8]"></i></div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {post.comments.map(comment => {
                        const author = getCommentAuthor(comment.userId);
                        return (
                            <div key={comment.id} className="flex gap-2">
                                <img src={author?.profileImage} className="w-8 h-8 rounded-full object-cover cursor-pointer" onClick={() => author && onProfileClick(author.id)} alt="" />
                                <div className="flex flex-col flex-1">
                                    <div className="bg-[#3A3B3C] p-3 rounded-2xl inline-block max-w-[95%]">
                                        <div className="font-bold text-[#E4E6EB] text-[13px] cursor-pointer hover:underline leading-tight" onClick={() => author && onProfileClick(author.id)}>{author?.name}</div>
                                        <p className="text-[#E4E6EB] text-[14px] leading-snug">{comment.text}</p>
                                    </div>
                                    <div className="flex gap-4 mt-1 ml-2 text-[12px] font-bold text-[#B0B3B8]">
                                        <span className="cursor-pointer hover:underline">Like</span>
                                        <span className="font-normal opacity-60">{comment.timestamp}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="p-4 border-t border-[#3E4042] bg-[#242526]">
                    {isGuest ? (
                        <div className="text-center p-2 bg-[#3A3B3C] rounded-lg text-[#B0B3B8] text-sm">
                            Please <span className="text-[#1877F2] font-bold cursor-pointer hover:underline">Log In</span> to join the conversation.
                        </div>
                    ) : (
                        <form onSubmit={(e) => { e.preventDefault(); onComment(post.id, text); setText(''); }} className="flex gap-2 items-center">
                            <img src={currentUser.profileImage} className="w-8 h-8 rounded-full object-cover" alt="" />
                            <div className="flex-1 bg-[#3A3B3C] rounded-full px-4 py-2 flex items-center">
                                <input 
                                    type="text" 
                                    value={text} 
                                    onChange={e => setText(e.target.value)} 
                                    placeholder="Write a comment..." 
                                    className="bg-transparent outline-none text-[#E4E6EB] w-full text-sm placeholder-[#B0B3B8]" 
                                />
                            </div>
                            <button type="submit" disabled={!text.trim()} className="text-[#1877F2] font-bold disabled:opacity-40">Post</button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export const CreatePostModal: React.FC<{ currentUser: User, onClose: () => void, onCreatePost: (t: string, f: File | null, type: any) => void }> = ({ currentUser, onClose, onCreatePost }) => {
    const [text, setText] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    return (
        <div className="fixed inset-0 z-[150] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
             <div className="bg-[#242526] w-full max-w-[500px] rounded-2xl border border-[#3E4042] shadow-2xl overflow-hidden flex flex-col">
                <div className="p-4 border-b border-[#3E4042] flex justify-between items-center">
                    <h3 className="font-bold text-[#E4E6EB]">Create Post</h3>
                    <i className="fas fa-times text-[#B0B3B8] cursor-pointer" onClick={onClose}></i>
                </div>
                <div className="p-4 flex-1">
                    <div className="flex items-center gap-2 mb-4">
                        <img src={currentUser.profileImage} className="w-10 h-10 rounded-full" alt="" />
                        <span className="font-bold text-[#E4E6EB]">{currentUser.name}</span>
                    </div>
                    <textarea 
                        className="w-full bg-transparent outline-none text-[#E4E6EB] placeholder-[#B0B3B8] resize-none text-[20px] min-h-[150px]" 
                        placeholder={`What's on your mind?`}
                        value={text} 
                        onChange={e => setText(e.target.value)} 
                        autoFocus
                    />
                </div>
                <div className="p-4 bg-[#242526] border-t border-[#3E4042]">
                    <button 
                        onClick={() => onCreatePost(text, selectedFile, 'text')} 
                        disabled={!text.trim() && !selectedFile} 
                        className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white font-bold py-2.5 rounded-lg disabled:opacity-50 transition-all"
                    >
                        Post
                    </button>
                </div>
             </div>
        </div>
    );
};

export const CreatePost: React.FC<{ currentUser: User, onClick: () => void }> = ({ currentUser, onClick }) => (
    <div className="bg-[#242526] rounded-xl p-4 mb-4 border border-[#3E4042]">
        <div className="flex gap-2">
            <img src={currentUser.profileImage} className="w-10 h-10 rounded-full object-cover" alt="" />
            <div className="flex-1 bg-[#3A3B3C] rounded-full px-4 py-2 text-[#B0B3B8] cursor-pointer hover:bg-[#4E4F50]" onClick={onClick}>
                What's on your mind, {currentUser.name.split(' ')[0]}?
            </div>
        </div>
    </div>
);

export const SuggestedProductsWidget: React.FC<{ products: Product[], onViewProduct: (p: Product) => void, onSeeAll: () => void }> = ({ products, onViewProduct, onSeeAll }) => {
    if (products.length === 0) return null;
    return (
        <div className="bg-[#242526] rounded-xl border border-[#3E4042] p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-[#E4E6EB]">Marketplace Picks</h3>
                <span className="text-[#1877F2] text-sm font-bold cursor-pointer hover:underline" onClick={onSeeAll}>See All</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
                {products.slice(0, 2).map(p => (
                    <div key={p.id} className="cursor-pointer" onClick={() => onViewProduct(p)}>
                        <img src={p.images[0]} className="aspect-square rounded-lg object-cover mb-1" alt="" />
                        <div className="text-xs font-bold text-[#E4E6EB] truncate">{p.title}</div>
                        <div className="text-xs text-[#F02849] font-black">${p.mainPrice}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};
