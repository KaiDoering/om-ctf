FROM python:3.11-alpine

WORKDIR /app

COPY . .
RUN pip install --no-cache-dir -r requirements.txt

RUN adduser -D python
USER python

CMD [ "python", "app.py" ]
