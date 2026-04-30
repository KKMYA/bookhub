FROM gradle:8.14-jdk21 AS build
WORKDIR /usr/src/app

# Copie du code source
COPY --chown=gradle:gradle . /usr/src/app

# Construction du JAR (on saute les tests pour accélérer le build Docker)
# Si tu veux exécuter les tests, retire le "-x test"
RUN gradle clean build -x test

# Étape 2 : Image d'exécution (Runtime)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Exposition du port
EXPOSE 9090

# Gradle génère le JAR dans build/libs/
ARG JAR_FILE=build/libs/*.jar
COPY --from=build /usr/src/app/${JAR_FILE} app.jar

# Lancement de l'application
ENTRYPOINT ["java", "-jar", "/app/app.jar"]