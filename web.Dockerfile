# to run docker-compose up --build
FROM node

# expose port 8080 for node
EXPOSE 8080

# make app directory
WORKDIR /home/node/app

# copy all files over
COPY package*.json ./

# install node deps
RUN npm install

# Bundle app source
COPY . .

# Create self-server certificates
# RUN openssl req -new -newkey rsa:4096 -days 365 -nodes -x509 \
#     -subj "/C=UK/ST=Denial/L=Springfield/O=Dis/CN=www.example.com" \
#     -keyout keytmp.pem  -out cert.pem
# RUN openssl rsa -in keytmp.pem -out key.pem

# run node
CMD [ "node", "server.js" ]