# Cape

Cape makes learning from YouTube effortless and distraction-free. Track your progress with daily streaks, take notes using the integrated Notion editor, and get playlist-specific help with a built-in AI chatbot.

## Tech

#### Frontend

- [Next.js](https://nextjs.org/)
- [Typescript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Block Notes](https://www.blocknotejs.org/)
- [YouTube API](https://developers.google.com/youtube/v3/getting-started)
- [DeepSeek API](https://api-docs.deepseek.com/)

#### Backend

- [Express.js](https://www.npmjs.com/package/express)
- [JavaScript](https://www.javascript.com/)
- [MongoDB](https://www.mongodb.com/)

## Demo

[Demo.webm](https://player.vimeo.com/video/1091094086?h=2e3d4ca95a)

# Folder Structure

<pre><code>
|--client
   |
   |--app
      |--api
      |--bookmark
      |--components
      |--course
      |--dashboard
      |--home
      |--redux
      |--utils
   |
|
</code></pre>

## Screenshots

![Course Page](https://private-user-images.githubusercontent.com/80352125/452167882-90a7b34e-b18d-4bc4-b183-0fabbd969757.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NDkxODc1NDgsIm5iZiI6MTc0OTE4NzI0OCwicGF0aCI6Ii84MDM1MjEyNS80NTIxNjc4ODItOTBhN2IzNGUtYjE4ZC00YmM0LWIxODMtMGZhYmJkOTY5NzU3LnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTA2MDYlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwNjA2VDA1MjA0OFomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTk1MjMzZDk4YzA1NWFkZTUwZGNjM2Q3MWQ5MDc1ODRmOGNkZmFjYTVlM2M2ZjI3MGRhMTE1MWRkNjBiMmU5YzEmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.pfbezM4RagvzpwJWCTAyanlpCFrM7WbTnP8VQUSfpNI)

![Dashborad Page](https://private-user-images.githubusercontent.com/80352125/452168355-e87ed53e-d60c-404a-8d0a-33a41c4be9bd.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NDkxODc2NjAsIm5iZiI6MTc0OTE4NzM2MCwicGF0aCI6Ii84MDM1MjEyNS80NTIxNjgzNTUtZTg3ZWQ1M2UtZDYwYy00MDRhLThkMGEtMzNhNDFjNGJlOWJkLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTA2MDYlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwNjA2VDA1MjI0MFomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWE5YzA5YTBhNzMzYTRlYjIwYTI1N2ExM2EwMjZmYWQ5NWNlY2EzMzE2ZTFjYzNlNzBjYmYxOWFiOGYwMzk4NWMmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.bT82g91gAPHEdpOHaerQPsCSg56_jwugxqsJmkEWhp8)

![Courses Page](https://private-user-images.githubusercontent.com/80352125/452168768-f33c436a-eb42-4c03-bb3f-c4a72a90b062.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NDkxODc3ODAsIm5iZiI6MTc0OTE4NzQ4MCwicGF0aCI6Ii84MDM1MjEyNS80NTIxNjg3NjgtZjMzYzQzNmEtZWI0Mi00YzAzLWJiM2YtYzRhNzJhOTBiMDYyLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTA2MDYlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwNjA2VDA1MjQ0MFomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWE0MThmYjRlOTFjZDYzN2ViMzYzYzk1ZjBlNzkzNmEwMzRhYTMwMzUwMDgwZWU3NTU3ZDZjNmY4MzgzM2NiZjUmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.9EUSOwD0NQnSjqx73XUl5b1g-5DmuAwXrWpgPhiouuA)

## Configuration and running the Project

### Configuration

- Clone the repository`https://github.com/anuprajvarma/cape.git`
- Inside the .env file write:`REACT_APP_BACKEND_URL = http://localhost:5400`

### Running the Project
