FROM ubuntu:24.04
RUN apt update -y && apt upgrade -y && apt install curl -y && apt install gnupg -y
RUN curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
RUN echo "deb https://packages.cloud.google.com/apt cloud-sdk main" | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
RUN apt update -y && apt upgrade -y && apt install golang-go -y && apt install git -y && apt install vim -y
RUN apt install google-cloud-cli-app-engine-go -y && apt install google-cloud-sdk
WORKDIR project
VOLUME logs
VOLUME code
ARG secret
ARG name_db_app
EXPOSE 8080
RUN touch run.sh
RUN echo '#!/bin/bash\n\
credentials=./resources/credentials/credentials.json\n\
urldbfirebase=https://${name_db_app}-default-rtdb.firebaseio.com/\n\
secret=${secret}' > .env
RUN echo '#!/bin/bash\n\
cd code\n\
go run main.go > ..logs/ur_app_manage_backend.log 2>&1 &' > run.sh
CMD ["sh","run.sh"]
