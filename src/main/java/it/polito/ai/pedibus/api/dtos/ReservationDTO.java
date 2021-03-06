package it.polito.ai.pedibus.api.dtos;

import com.mongodb.lang.Nullable;
import it.polito.ai.pedibus.api.models.Child;
import it.polito.ai.pedibus.api.models.Reservation;
import lombok.Data;
import org.bson.types.ObjectId;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import java.time.LocalDate;
import java.util.List;

@Data
public class ReservationDTO {
    // TODO: Set constraints
    @NotNull
    private String stopName;
    @NotNull
    private ObjectId child;
    @NotNull
    private Reservation.Direction direction;
    @NotNull
    @Min(0)
    private Integer tripIndex;

    @Nullable
    private String lineName;
}
