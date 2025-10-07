# Chat Implementation Guide

## Overview
This implementation provides a real-time chat system using long polling instead of WebSockets. The system includes:

- Chat list screen showing all conversations
- Individual chat screen for messaging
- Long polling service for background message updates
- Redux integration for state management

## Features

### 1. Long Polling Service
- Polls the server every 6 seconds for new messages
- Automatically detects and appends new messages to conversations
- Handles background updates smoothly without user interruption
- Starts/stops based on screen focus

### 2. Chat List Screen (`ChatListScreen`)
- Displays all conversations with last message preview
- Shows unread message counts
- Real-time updates via long polling
- Pull-to-refresh functionality
- Navigation to individual chat screens

### 3. Individual Chat Screen (`ChatScreen`)
- Real-time message display
- Message input with send functionality
- Automatic scrolling to new messages
- Message timestamps
- Different styling for sent vs received messages

### 4. Redux Integration
- Actions: `onSendMessage`, `onGetConversation`, `onGetChatList`, `onStartLongPolling`, `onStopLongPolling`
- State management for messages, conversations, and polling status
- Saga functions for API calls and long polling coordination

## API Endpoints

### Send Message
- **POST** `/user/sendmessage`
- **Body**: `{ "receiverId": "string", "message": "string" }`

### Get Conversation
- **POST** `/user/conversation`
- **Body**: `{ "otherUserId": "string" }`

### Get Chat List
- **GET** `/user/chatlist`

## Usage

### Starting a Chat
1. Navigate to a club profile screen
2. Tap the message icon
3. This will open the chat screen with the club owner

### Viewing All Chats
1. Navigate to the Chat tab in the bottom navigation
2. See all conversations with last message previews
3. Tap any conversation to open the individual chat

### Sending Messages
1. Open a chat conversation
2. Type your message in the input field
3. Tap "Send" or press enter
4. Message will be sent and appear in the conversation

## Technical Details

### Long Polling Implementation
- Service runs in the background when chat screens are focused
- Compares message IDs and timestamps to detect new messages
- Only updates UI when new messages are found
- Handles network errors gracefully

### State Management
- Messages are stored in Redux state
- Real-time updates are handled via Redux actions
- Conversation data is cached for performance

### Navigation
- Chat screens are integrated into the main navigation stack
- Proper parameter passing for user information
- Back navigation support

## File Structure
```
src/
├── screen/dashboard/user/chatScreen/
│   ├── chatListScreen.tsx
│   └── chatScreen.tsx
├── services/
│   └── longPollingService.ts
├── redux/auth/
│   ├── actions.tsx (updated with chat actions)
│   ├── reducer.tsx (updated with chat state)
│   └── saga.tsx (updated with chat sagas)
└── navigation/
    └── navigation.tsx (updated with chat screens)
```

## Configuration
- Polling interval: 6 seconds
- Base URL: `http://54.241.179.201/vr-api/`
- Message character limit: 500 characters
- Auto-scroll to new messages enabled

## Error Handling
- Network errors are handled gracefully
- Failed message sends show error alerts
- Long polling continues even after errors
- User feedback for all operations
