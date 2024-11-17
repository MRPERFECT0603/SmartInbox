# SmartInbox

SmartInbox is an AI-powered tool I've developed to efficiently manage and organize my Gmail inbox. It leverages my custom OLAMA model, built on the Retrieval-Augmented Generation (RAG) approach, for response generation and contextual analysis. Using RabbitMQ for task scheduling, SmartInbox automates email categorization, response generation, and inbox management, ensuring a streamlined and effective communication process.

## Features

- **Custom Email Categorization**: My OLAMA model uses RAG to retrieve contextually relevant information and analyze incoming emails. It categorizes emails into meaningful labels based on this analysis, making inbox management easier and more accurate.
- **AI-Powered Replies**: With RAG-based OLAMA, the model generates responses by retrieving context from external sources and combining it with email content, allowing for highly relevant, accurate, and context-aware replies.
- **Inbox Organization**: SmartInbox automatically organizes emails by categorizing them, applying labels, and archiving them based on the RAG model’s categorization.
- **Scalable and Efficient**: RabbitMQ handles task scheduling and ensures reliable processing, enabling the system to scale efficiently and handle high email volumes without issues.

## Architecture Overview

### Email Fetching

- **Cron Job**: A cron job runs on a scheduled basis to fetch new emails from my Gmail account at set intervals.
- **RabbitMQ**: Once the emails are fetched, they are sent to RabbitMQ, which ensures reliable queuing and processing.

### Email Processing and Analysis

- **Node.js Service**: The Node.js service retrieves emails from RabbitMQ and sends them to my OLAMA model for processing.
- **OLAMA Model with RAG**: The model uses the Retrieval-Augmented Generation approach to retrieve context from external sources, combining it with the email content to generate accurate responses and categorize emails. The retrieval process ensures that responses are contextually relevant and precise.
- **RabbitMQ**: RabbitMQ manages task scheduling for both the email processing and response generation phases, ensuring smooth and efficient operations.

### Automated Email Response

- Based on the analysis and context retrieval, the OLAMA model generates responses that are sent back to the sender through the Gmail API.
- **Gmail API**: The replies are sent through the Gmail API, and I update the email labels accordingly (e.g., "Interested," "Not Interested").
- **Inbox Management**: Emails are categorized, labeled, and organized automatically based on their content and relevance, allowing for easy tracking and follow-up.

## Technical Stack

- **Languages**: JavaScript, Node.js
- **AI/ML**: OLAMA model built on a Retrieval-Augmented Generation (RAG) framework (for NLP-based categorization and response generation)
- **Task Scheduling**: RabbitMQ
- **Message Queuing**: RabbitMQ (for handling email message queues)
- **Email Integration**: Gmail API
- **Infrastructure**: Cron jobs for scheduled tasks