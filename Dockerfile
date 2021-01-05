FROM node:10.20.1-alpine3.11 as BASE

#FROM python:3.6-alpine3.11 as BASE
WORKDIR /opt/app/
COPY . .
RUN cd /opt/app/client && npm i && npm run build && cd .. && rm -rf client

FROM python:3.6-alpine3.11
COPY --from=BASE /opt/app /opt/app/
WORKDIR /opt/app/
RUN apk add --no-cache bash gcc libc-dev linux-headers \
    && cd /opt/app \
    && pip install --no-cache-dir -r requirements.txt \
    && apk del gcc libc-dev linux-headers \
    && rm -rf /var/cache/apk/* \
    && python manage.py makemigrations \
    && python manage.py migrate \
    && python manage.py collectstatic --no-input

EXPOSE 8000

ENV DEBUG=True

CMD ["/bin/bash", "-c", "uwsgi --ini uwsgi.ini --static-map /static=/opt/app/templates/static" ]

