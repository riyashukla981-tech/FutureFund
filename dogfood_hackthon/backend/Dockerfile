FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY pom.xml ./
COPY src ./src

RUN mvn -q -DskipTests package

EXPOSE 8080

CMD ["java", "-jar", "target/dogfood-0.0.1-SNAPSHOT.jar"]
