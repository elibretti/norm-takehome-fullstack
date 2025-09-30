# Westeros Laws Service and Client

This repository contains two components:

- **Backend Service** – A FastAPI application for querying laws parsed from a PDF
- **Frontend Client** – A  Next.js app for interacting with the backend

## Backend Setup

The backend provides a service that parses `docs/laws.pdf` (laws from the fictional series Game of Thrones) and exposes a queryable API.

### Steps to Run

1. **Install Docker Desktop**
   - Download and install from [Docker Desktop](https://www.docker.com/products/docker-desktop/)

2. **Create an environment file**
   - Add your OpenAI key in a `.env` file at the root of the repository:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

3. **Build and run the containers**
   ```bash
   docker-compose up --build
   ```

4. **Access the API**
   - The service will be available at:
   ```
   http://localhost:80/laws?query={your_question}
   ```

## Frontend Setup (Next.js)

A Next.js client is provided under the `frontend` directory.

### Steps to Run

1. **Navigate to the frontend folder:**
   ```bash
   cd frontend
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   Or follow the instructions in the `frontend/README.md`.

## Backend Design Choices

- **PDF Parsing** – Used [PyMuPDF](https://pymupdf.readthedocs.io/) to detect font styles (bold, size) and distinguish headers from body text.

- **Section Handling** – Didn't store top level categories like "1. Peace, 2. Religion", just store the laws themselves

- **Pattern based Parsing** – Implemented pattern based parsing rather than hardcoding section names, making it reusable for similarly formatted documents.

- **Future Improvement** – Storing headers in metadata would allow categorization of each law ("Religion," "Peace"). This could be helpful when querying general categories like "What are the laws about Religion?" 

## Frontend Design Choices

- **Search Experience** – UI designed as a search engine for an intuitive experience.

- **Past Queries** – Displayed below the search box in chronological order, however for the sake of time they are only 
stored in state on the component, so a refresh of the screen will clear them 

- **Document Display** – Used an iframe to show the PDF directly since there is only one document.

- **Navigation** – Main page links to `/documents` and `/chat` to reduce clutter on the landing page.

- **UI Consistency** – Continued using Chakra UI components to stay consistent with the original template. 

