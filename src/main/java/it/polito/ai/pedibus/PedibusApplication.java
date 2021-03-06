package it.polito.ai.pedibus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.data.mongodb.repository.config.EnableReactiveMongoRepositories;

import java.util.TimeZone;

@EnableMongoAuditing
@EnableReactiveMongoRepositories
@EnableMongoRepositories
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class PedibusApplication {

    public static void main(String[] args) {
        TimeZone.setDefault(TimeZone.getTimeZone("Europe/Rome"));
        SpringApplication.run(PedibusApplication.class, args);
    }
}
