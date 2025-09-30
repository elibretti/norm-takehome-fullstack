# Use the official Python image from the Docker Hub
FROM python:3.11-slim

WORKDIR /app

# Copy the dependencies file to the working directory
COPY requirements.txt .

# Install any dependencies
RUN pip install --no-cache-dir --upgrade -r requirements.txt
RUN pip install uvicorn

# API key
ENV OPENAI_API_KEY=$OPENAI_API_KEY

# Copy the content of the local src directory to the working directory
COPY ./app ./app
COPY ./docs ./docs

# Command to run on container start
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]