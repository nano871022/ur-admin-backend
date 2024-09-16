# ur_admin-backend
backend project to work with ur-admin-site that is frontend

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
