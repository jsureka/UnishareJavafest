FROM openjdk:20
VOLUME /tmp
EXPOSE 8080
ARG JAR_FILE=target/backend-0.0.1-SNAPSHOT.jar
ADD ${JAR_FILE} unishare-server.jar
ENTRYPOINT ["java","-jar","/unishare-server.jar"]