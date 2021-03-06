package it.polito.ai.pedibus.api.repositories;

import it.polito.ai.pedibus.api.models.Reservation;
import net.bytebuddy.dynamic.loading.ClassInjector;
import org.apache.tomcat.jni.Local;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservationRepository extends MongoRepository<Reservation, String> {
    List<Reservation> findByLineNameAndDate(String lineName, LocalDate date);
    Reservation findById(ObjectId objectId);
    Reservation findByLineNameAndDateAndId(String linename, LocalDate date, ObjectId id);
    void deleteById(ObjectId id);

    List<Reservation> findByLineNameAndDateAndUser(String linename, LocalDate date, ObjectId user);
    List<Reservation> findByUser(ObjectId user);

    Reservation findFirstByLineNameAndDateAndTripIndexAndDirectionAndUser(String lineName,
                                                                          LocalDate date,
                                                                          Integer tripIndex,
                                                                          Reservation.Direction direction,
                                                                          ObjectId user);

    List<Reservation> findByUserAndDate(ObjectId user, LocalDate date);

    void deleteByChildId(ObjectId childId);

    List<Reservation> findAllByDateAndLineNameAndDirectionAndTripIndex(LocalDate date, String lineName,
                                                                       Reservation.Direction direction, Integer tripIndex);

    List<Reservation> findAllByDateAndLineNameAndDirectionAndChildId(LocalDate date, String lineName,
                                                                              Reservation.Direction direction,
                                                                              ObjectId childId);

    List<Reservation> findByDateAndUser(LocalDate date, ObjectId userId);

    List<Reservation> findByDateGreaterThanEqualAndChildId(LocalDate date, ObjectId childId);

    Reservation findByDateAndDirectionAndId(LocalDate date, Reservation.Direction direction, ObjectId id);
}

