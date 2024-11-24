# Resume Creator (ATS-Friendly)

This project is a Resume Creator designed to generate **ATS-friendly (Applicant Tracking System)** resumes. The application includes a **React-based frontend**, a **Django-based backend**, and **MongoDB Atlas** as the database. Users can register, log in, input their details, preview their resumes, and download them as PDF files.

---

## Features

- User-friendly interface to input resume details.
- Dynamic resume preview and generation.
- Support for both experienced professionals and freshers.
- Backend integration with MongoDB for secure user data storage.
- Downloadable PDF resumes.

---

## Requirements

### Frontend
- Node.js (v14 or higher)
- npm or yarn (for managing dependencies)

### Backend
- Python (3.10 or higher)
- Virtual environment (`venv`)
- Django (3.2)
- pymongo (3.11.4)
- djongo (1.3.6)
- djangorestframework (3.12.4)
- dnspython (2.7.0)
- MongoDB Atlas account and cluster setup

---

## Installation Guide

### Clone the Repository

```bash
git clone https://github.com/Hariharanpugazh/Resume-Creator-ATS-.git
cd Resume-Creator-ATS-
```

---

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

   The frontend should now be running on `http://localhost:3000`.

---

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Create a virtual environment:

   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:

   - **Windows**:
     ```bash
     venv\Scripts\activate
     ```

   - **macOS/Linux**:
     ```bash
     source venv/bin/activate
     ```

4. Install the required Python packages:

   ```bash
   pip install -r requirements.txt
   ```

5. Set up the database connection:
   - Go to your MongoDB Atlas account.
   - Create a new cluster and database named `resume_creator`.
   - Update the `settings.py` file with your MongoDB connection string.

6. Run database migrations:

   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

7. Start the Django server:

   ```bash
   python manage.py runserver
   ```

   The backend should now be running on `http://127.0.0.1:8000`.

---

### MongoDB Atlas Setup

1. Sign in or create a new account on [MongoDB Atlas](https://www.mongodb.com/atlas/database).
2. Create a new cluster and database named `resume_creator`.
3. Create two collections:
   - **Users**: To store user login details.
   - **Resumes**: To store resume-related data.

4. Whitelist your IP address in the MongoDB Atlas dashboard.
5. Copy the connection URI and paste it into the `settings.py` file in the backend.

---

### Running the Project

1. Make sure the backend server and frontend server are running.
2. Open the frontend in your browser (`http://localhost:3000`).
3. Register a new user or log in to an existing account.
4. Fill out the resume details form.
5. Preview the resume and download it as a PDF.

---

## Commands Cheat Sheet

### Frontend

- Install dependencies: `npm install`
- Start development server: `npm start`
- Build for production: `npm run build`

### Backend

- Create virtual environment: `python -m venv venv`
- Activate virtual environment:
  - Windows: `venv\Scripts\activate`
  - macOS/Linux: `source venv/bin/activate`
- Install dependencies: `pip install -r requirements.txt`
- Run migrations: `python manage.py migrate`
- Start server: `python manage.py runserver`

---

## File Structure

```
Resume-Creator-ATS-
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   └── App.js
│   └── package.json
│
├── backend/
│   ├── resume_creator/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── manage.py
│   └── requirements.txt
│
└── README.md
```

---

## Notes

- Ensure you have a stable internet connection for MongoDB Atlas.
- For beginners:
  - Refer to [MongoDB Atlas Documentation](https://www.mongodb.com/docs/atlas/) for database setup.
  - Learn more about Django from [Django Documentation](https://docs.djangoproject.com/en/stable/).
  - Explore React tutorials at [React Docs](https://react.dev/learn).

---

Feel free to contribute to the project by creating issues or submitting pull requests!

---

