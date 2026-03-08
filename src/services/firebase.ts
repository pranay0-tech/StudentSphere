import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, onSnapshot, doc, updateDoc, increment, arrayUnion, Timestamp } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

// Replace with your real Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);
// export const auth = getAuth(app);

// Mocking Firebase for the preview
export const mockPosts = [
  {
    id: "1",
    content: "I'm so stressed about my finals. Does anyone have any study tips for CS?",
    category: "Study Help",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    likesCount: 12,
    commentsCount: 3,
    reportsCount: 0,
    repostsCount: 2,
    campus: "Stanford University",
    authorId: "user1",
    reactions: { agree: 4 }
  },
  {
    id: "2",
    content: "Confession: I've been sneaking into the library after hours just to use the fast Wi-Fi.",
    category: "Confession",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    likesCount: 45,
    commentsCount: 10,
    reportsCount: 0,
    repostsCount: 5,
    campus: "MIT",
    authorId: "user2",
    reactions: { agree: 15 }
  },
  {
    id: "3",
    content: "Does anyone else feel like they're just pretending to be an adult? #MentalHealth",
    category: "Mental Health",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    likesCount: 89,
    commentsCount: 25,
    reportsCount: 0,
    repostsCount: 12,
    campus: "UC Berkeley",
    authorId: "user3",
    reactions: { agree: 30 },
    poll: {
      question: "Should the campus library be open 24/7 during finals?",
      options: [
        { id: "0", text: "Yes, definitely!", votes: 120 },
        { id: "1", text: "No, we need sleep.", votes: 45 },
        { id: "2", text: "Only the quiet floor.", votes: 30 }
      ]
    }
  }
];

export const mockComments = [
  { id: "c1", postId: "1", content: "Try the Pomodoro technique! It really helped me.", timestamp: new Date().toISOString(), authorId: "user4" },
  { id: "c2", postId: "1", content: "Focus on the practice problems from the textbook.", timestamp: new Date().toISOString(), authorId: "user5" }
];
