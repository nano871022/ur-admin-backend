FROM ubuntu:24.04
RUN apt update -y && apt upgrade -y && apt install golang-go -y && apt install git -y
VOLUME code
EXPOSE 8080
RUN touch run.sh
RUN echo '#!/bin/bash\n\
go run main.go' > run.sh
CMD ["sh","run.sh"]
