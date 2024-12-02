# Step 1: Use an official Python base image
FROM python:3.11-slim

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy the requirements.txt file into the container
COPY requirements.txt .

# Step 4: Install the dependencies from requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Step 5: Copy the entire Flask application into the container
COPY . .

# Step 6: Expose the port the app will run on (default Flask port is 5000)
EXPOSE 5000

# Step 7: Define the environment variable for Flask
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0

# Step 8: Run the Flask app
CMD ["flask", "run"]
