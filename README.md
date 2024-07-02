# MailzyAI

MailzyAI is an innovative AI-powered tool designed to help users manage and organize their Gmail inboxes effortlessly. By leveraging advanced machine learning models and robust task scheduling frameworks, MailzyAI automates email categorization and response, ensuring a clutter-free inbox and efficient communication.

## Features

- **Automated Email Categorization**: Uses Google NLP to understand the context of incoming emails and automatically categorize them into meaningful labels.
- **AI-Powered Replies**: Generates and sends automated responses based on the email content, saving users time and effort.
- **Inbox Organization**: Helps users maintain an organized and clutter-free inbox by categorizing and labeling emails.
- **Scalable and Efficient**: Utilizes Kafka for message queuing and BullMQ for task scheduling, ensuring the system can handle large volumes of emails efficiently.

## Architecture Overview

### Email Fetching

- **Cron Job**: A scheduled cron job fetches new emails from the user's Gmail account at regular intervals.
- **Kafka**: The fetched emails are sent to Kafka, ensuring reliable message queuing and delivery to the processing pipeline.

### Email Processing and Analysis

- **Node.js Service**: The Node.js service retrieves emails from Kafka and forwards them to the analyzer service.
- **Analyzer Service**: Utilizes Google NLP models to analyze the content of each email, categorizing it into predefined labels such as "Interested," "Not Interested," and "More Information."
- **BullMQ**: Manages task scheduling and queuing for both the processing and response phases, ensuring efficient and scalable operations.

### Automated Email Response

- Based on the analysis, the service generates contextually appropriate replies using AI and sends them to the original sender.
- **Gmail API**: The replies are sent using the Gmail API, and the corresponding labels are updated to reflect the categorization.

## Technical Stack

- **Languages**: TypeScript, Node.js
- **AI/ML**: Google NLP models
- **Task Scheduling**: BullMQ
- **Message Queuing**: Kafka
- **Email Integration**: Gmail API
- **Infrastructure**: Cron jobs for scheduled tasks
