# Build stage
FROM eclipse-temurin:17-jdk-jammy AS builder

WORKDIR /app

# Copy build files
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src

# Build the application
RUN ./mvnw clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

# Copy the built jar from the builder image
COPY --from=builder /app/target/kube-tasks-backend-*.jar app.jar

EXPOSE 8088
ENV SPRING_PROFILES_ACTIVE=prod
ENTRYPOINT ["java", "-jar", "app.jar"]