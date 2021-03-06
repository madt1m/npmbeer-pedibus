package it.polito.ai.pedibus.api.repositories;

import it.polito.ai.pedibus.api.models.EmailVerificationToken;
import it.polito.ai.pedibus.api.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailVerificationTokenRepository extends MongoRepository<EmailVerificationToken,String> {
    EmailVerificationToken findByToken(String token);

    EmailVerificationToken findByUser(User user);
    EmailVerificationToken getByUser(User user);

}
