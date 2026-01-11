
import { LocationData } from './types';

// Exporting required locations for various search components
export const LOCATIONS_DATA: LocationData[] = [
    { name: "Arusha, Tanzania", flag: "🇹🇿" },
    { name: "Dar es Salaam, Tanzania", flag: "🇹🇿" },
    { name: "Nairobi, Kenya", flag: "🇰🇪" },
    { name: "Lagos, Nigeria", flag: "🇳🇬" },
    { name: "Johannesburg, South Africa", flag: "🇿🇦" },
    { name: "London, United Kingdom", flag: "🇬🇧" },
    { name: "New York, USA", flag: "🇺🇸" },
];

export const MARKETPLACE_CATEGORIES = [
    { id: 'all', name: 'All Products' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'books', name: 'Books' },
    { id: 'services', name: 'Services' },
    { id: 'clothing', name: 'Clothing' },
];

export const MARKETPLACE_COUNTRIES = [
    { code: "all", name: "All Countries", currency: "", symbol: "", flag: "🌍" },
    { code: "TZ", name: "Tanzania", currency: "TZS", symbol: "TSh", flag: "🇹🇿" },
    { code: "US", name: "United States", currency: "USD", symbol: "$", flag: "🇺🇸" },
];

export const REACTION_ICONS: Record<string, string> = {
    like: "👍", love: "❤️", haha: "😆", wow: "😮", sad: "😢", angry: "😡"
};

export const TRANSLATIONS: Record<string, any> = {
    en: {
        tagline: "Connect with friends and the world around you on UNERA.",
        login_btn: "Log In",
        home: "Home",
        friends: "Friends",
        create_post_title: "Create Post",
        watch: "Watch"
    },
    sw: {
        tagline: "Ungana na marafiki...",
        home: "Nyumbani",
        create_post_title: "Unda Posti",
        watch: "Tazama"
    }
};

// Mock data for UI placeholders only (Non-dynamic)
export const STICKER_PACKS = {
    "All": ["https://media.giphy.com/media/l41Fj8afUOMY8vQc/giphy.gif"],
};

export const EMOJI_LIST = ["😀", "😃", "😄", "😁", "😆", "😅", "😂"];

// Fix: Adding missing mock data required by components
export const INITIAL_USERS = [
    {
        id: 1,
        name: "Amani UNERA",
        profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        isOnline: true,
        followers: [2],
        following: [2],
        location: "Arusha, Tanzania",
        bio: "Founder of UNERA Network. Connecting the world.",
        isVerified: true,
    },
    {
        id: 2,
        name: "Sarah Miller",
        profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        isOnline: true,
        followers: [1],
        following: [1],
        location: "Nairobi, Kenya",
        bio: "Photographer and traveler.",
    }
];

export const MOCK_SONGS = [
    {
        id: "s1",
        title: "Sunset Vibes",
        artist: "DJ UNERA",
        album: "Summer 2025",
        cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=500&q=60",
        duration: "3:45",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        stats: { plays: 15000, downloads: 1200, shares: 450, likes: 2300, reelsUse: 120 },
        uploaderId: 1
    }
];

export const MOCK_ALBUMS = [
    {
        id: "a1",
        title: "UNERA Originals Vol. 1",
        artist: "Various Artists",
        cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=500&q=60",
        year: "2025",
        songs: ["s1"]
    }
];

export const MOCK_PODCASTS = [
    {
        id: "p1",
        title: "The Entrepreneur's Journey",
        host: "John Smith",
        cover: "https://images.unsplash.com/photo-1478737270239-2fccd27ee086?auto=format&fit=crop&w=500&q=60",
        description: "Stories of success and failure in business.",
        category: "Business",
        followers: 12000
    }
];

export const MOCK_EPISODES = [
    {
        id: "e1",
        podcastId: "p1",
        title: "Episode 1: Starting from Zero",
        description: "How to build a brand with no budget.",
        date: "2024-02-10",
        duration: "45:30",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        thumbnail: "https://images.unsplash.com/photo-1478737270239-2fccd27ee086?auto=format&fit=crop&w=500&q=60",
        stats: { plays: 5400, downloads: 800, shares: 120, likes: 450, reelsUse: 0 },
        uploaderId: 1,
        host: "John Smith"
    }
];

export const BRAND_CATEGORIES = ["Technology", "Fashion", "Entertainment", "Real Estate", "Education", "Health & Wellness"];
