# StudentSphere

## Overview

StudentSphere is an anonymous social platform designed specifically for students to express thoughts, share experiences, and interact freely within their campus community. The platform allows students to post messages, discussions, and feedback without revealing their identity, creating a safe and open environment for honest conversations.

The goal of StudentSphere is to give every student a voice. Many students hesitate to share opinions, problems, or ideas publicly. This platform removes that barrier by enabling anonymous participation while still maintaining a structured and respectful digital community.

---

## What the Application Does

StudentSphere provides a simple and user-friendly interface where students can interact anonymously. Users can post messages, view discussions from other students, and engage with the campus community in a transparent but identity-free environment.

Key features include:

* Anonymous posting for students
* Community feed to view posts from other students
* Clean and modern user interface with dark and light themes
* AI-assisted moderation to keep conversations respectful
* Feedback system for improving the platform
* Real-time interaction powered by cloud services

This platform is especially useful for sharing campus opinions, confessions, ideas, feedback about college life, and general student discussions.

---

## Tech Stack

Frontend

* React
* TypeScript
* Vite
* CSS

Backend & Services

* Firebase (Database and hosting services)
* Google Gemini API (AI features and moderation)

Tools & Deployment

* GitHub for version control
* Vercel for deployment

---

## Project Architecture

The application follows a modern component-based architecture.

User Interface (React Components)
→ State Management using React Context
→ Service Layer for API and Firebase interactions
→ Cloud Services for data storage and AI processing

This structure ensures scalability, maintainability, and smooth performance.

---

## Team Contributions

This project was developed collaboratively with contributions from the following team members.

Avinash Reddy
Project Lead & Full Stack Development

* Designed the core idea of the platform
* Developed the main application structure
* Implemented frontend architecture and UI components
* Integrated Firebase services and deployment setup

Pranay
Frontend Developer

* Assisted in designing and improving the user interface
* Contributed to component structure and layout improvements
* Helped implement responsive design and UI interactions

Yeshwanth
Feature Development & Testing

* Assisted with feature implementation and testing
* Contributed to improving functionality and user experience
* Participated in debugging and validating application behavior

---

## Future Improvements

The project can be extended with several additional features such as:

* User communities for different colleges
* Upvote and reaction system for posts
* AI-powered content moderation
* Mobile application support
* Real-time notifications

---

## Conclusion

StudentSphere aims to empower students by providing a platform where ideas, opinions, and experiences can be shared freely. By combining modern web technologies with a clean user experience, the platform encourages honest conversations and stronger campus engagement.

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

made with love by ace