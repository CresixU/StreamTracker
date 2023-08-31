FROM node:lts-slim

WORKDIR /var/www/tracker

RUN apt-get update -y
RUN apt-get install -y apache2
RUN apt-get install -y systemd systemd-sysv dbus dbus-user-session
RUN printf "systemctl start systemd-logind" >> /etc/profile

COPY . .
COPY ./bin/tracker.conf /etc/apache2/sites-available/

RUN chmod -R 755 /var/www/tracker

RUN rm -rf node_modules
RUN npm cache clean --force
RUN npm install
RUN npm install --dev
RUN npm install sass

RUN a2ensite tracker
RUN a2dissite 000-default.conf

RUN . /etc/apache2/envvars
RUN mkdir -p /var/run/apache2

ENTRYPOINT ["apache2ctl", "-D", "FOREGROUND"]
