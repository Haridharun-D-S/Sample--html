FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

COPY templates ./templates
RUN pip install -r requirements.txt

COPY app.py .

EXPOSE 5000

CMD ["python","app.py"]