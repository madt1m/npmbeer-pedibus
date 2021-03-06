package it.polito.ai.pedibus.api.repositories;

import it.polito.ai.pedibus.api.models.RecoveryToken;
import org.hibernate.validator.constraints.pl.REGON;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecoveryTokenRepository extends MongoRepository<RecoveryToken,String> {

    RecoveryToken findByToken(String recoveryToken);
}
