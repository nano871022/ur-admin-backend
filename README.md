# ur_admin-backend
backend project to work with ur-admin-site that is frontend

create hardling from folder with credentials files to /project/code/resources/credentials, this help us with security and dont upload this files in this project
> ln <folder-credentilas/<firebase-credential>.json credentials.json

# Go lang

comands to connect go with firebase Sept 2024

1. create module
> go mod init <project-name>
2. install firebase SKD on go
> go get firebase.google.com/go/v4
3. create code of project, start point file should be main.go and create another file you needed.
4. run project
> go run main.go

# Docker file

this project containt a docker file to run in container dev on local
this file run ubuntu V 24.04 updated , and upgrade when it is building
this install golang-go libraries to work and git 

## settings

* workdir: /project ## this is for main folder
* volumen: /code ## in this folde your connect the code of project
* EXPOSE: 8080 ## this port is about what it'll use to run services

## docker build 
> sudo docker build -t ur-admin-backend:0.0.001 .

## docker run
> sudo docker run -d -v $PWD:/project/code -p 8090:8080 --name ur-admin-backend-00001 ur-admin-backend:0.0.001

## App Engine GCLOUD Commands

> gcloud auth login
> gcloud config set project <project-name>
> gcloud projects create <project-name> --set-as-default
> gcloud app create
> gcloud app deploy