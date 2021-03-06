package it.polito.ai.pedibus.api.models;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.mongodb.lang.Nullable;
import it.polito.ai.pedibus.api.serializers.ObjectIdSerializer;
import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.Email;
import javax.validation.constraints.Null;
import java.time.LocalDate;

@Data
@Document(collection = "children")
public class Child {
    @Id
    @JsonSerialize(using = ObjectIdSerializer.class)
    ObjectId id;

    private String name;

    private String surname;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate birthday;

    private Sex gender;

    private boolean disability;

    private boolean photo;

    public enum Sex {
        F,
        M
    }

    @Nullable
    private String other;

}
