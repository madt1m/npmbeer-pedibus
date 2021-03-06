package it.polito.ai.pedibus.api.controllers;


import it.polito.ai.pedibus.api.constraints.ReservationPostFields;
import it.polito.ai.pedibus.api.constraints.ReservationPutFields;
import it.polito.ai.pedibus.api.dtos.ReservationDTO;
import it.polito.ai.pedibus.api.models.Reservation;
import it.polito.ai.pedibus.api.services.ReservationService;
import it.polito.ai.pedibus.security.CustomUserDetails;
import org.bson.types.ObjectId;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin
@Validated
@RestController
@RequestMapping("/reservations/user")
public class ReservationUserController {

    private final ReservationService reservationService;

    public ReservationUserController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @RequestMapping(value = "/all", method = RequestMethod.GET)
    public List<Reservation> getUserReservations() {
        return reservationService.getAllUserReservations();
    }

    /**
     * GET /reservations/user/{nome_linea}/{data} –> Restituisce un array JSON,
     * riportante le prenotazioni dell'utente per quella data e linea
     *
     * @param lineName
     * @param dateString
     * @return
     */
    @RequestMapping(value = "/{lineName}/{date}", method = RequestMethod.GET)
    public List<Reservation> getOwnReservationsByLineAndDate(@PathVariable("lineName") String lineName,
                                                 @PathVariable("date") String dateString) {
        return reservationService.getUserReservationsByDateAndLine(lineName, dateString);
    }


    /**
     * GET /reservations/user/{data} –> Restituisce una array JSON
     * riportante le prenotazioni dell'utente per quella data
     *
     * @param dateString
     * @return
     */
    @RequestMapping(value = "/{date}", method = RequestMethod.GET)
    public List<Reservation> getOwnReservationsByLineAndDate(@PathVariable("date") String dateString) {
        return reservationService.getUserReservationsByDate(dateString);
    }

    /**
     * POST /reservations/user/{nome_linea}/{data} – invia un oggetto JSON contenente il nome
     * dell’alunno da trasportare, l’identificatore della fermata a cui sale/scende e il verso di
     * percorrenza (andata/ritorno); restituisce un identificatore univoco della prenotazione
     * creata
     */
    @Transactional
    @ReservationPostFields
    @RequestMapping(value = "{lineName}/{date}", method = RequestMethod.POST)
    public Reservation insert(@PathVariable("lineName") String lineName,
                         @PathVariable("date") String dateString,
                         @RequestBody ReservationDTO resd) {
        return reservationService.insertReservationUser(lineName, dateString, resd);
    }

    /**
     * PUT /reservations/user/{nome_linea}/{data}/{reservation_id} – invia un oggetto JSON che
     * permette di aggiornare i dati relativi alla prenotazione indicata.
     *
     * NOTA BENE: id è l'identificativo della prenotazione da aggiornare, di fatto, l'unico campo modificabile è la fermata.
     *
     * @param lineName
     * @param dateString
     * @param id
     * @param resd
     */
    @Transactional
    @ReservationPutFields
    @RequestMapping(value = "{lineName}/{date}/{id}", method = RequestMethod.PUT)
    public void update(@PathVariable("lineName") String lineName,
                       @PathVariable("date") String dateString,
                       @PathVariable("id") ObjectId id,
                       @RequestBody ReservationDTO resd) {

        reservationService.updateReservationUser(lineName, dateString, resd, id);
    }

    /**
     * DELETE /reservations/user/{nome_linea}/{data}/{reservation_id} – elimina la prenotazione
     * indicata.
     *
     * @param lineName
     * @param dateString
     * @param id
     */
    @Transactional
    @RequestMapping(value = "{lineName}/{date}/{id}", method = RequestMethod.DELETE)
    public void delete(@PathVariable("lineName") String lineName,
                       @PathVariable("date") String dateString,
                       @PathVariable("id") ObjectId id) {
        reservationService.deleteReservationUser(lineName, dateString, id);
    }

    /**
     * GET /reservations/user/{nome_linea}/{data}/{reservation_id} – restituisce la prenotazione
     *
     * @param lineName
     * @param dateString
     * @param id
     * @return
     */
    @RequestMapping(value = "{lineName}/{date}/{id}", method = RequestMethod.GET)
    public Reservation getReservation(@PathVariable("lineName") String lineName,
                                      @PathVariable("date") String dateString,
                                      @PathVariable("id") ObjectId id) {

        return reservationService.getReservationUser(lineName, dateString, id);
    }


    @RequestMapping(value = "today", method = RequestMethod.GET)
    public List<Reservation> getTodayReservations(){
        LocalDate today = LocalDate.now();
        ObjectId userId = ((CustomUserDetails)SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
        return this.reservationService.getReservationsByDateAndUser(today, userId);
    }

    @RequestMapping(value = "{child}/from/{date}", method = RequestMethod.GET)
    public List<Reservation> getReservationsFromDate(@PathVariable("date") String dateString,
                                                     @PathVariable("child") ObjectId childId){
        ObjectId userId = ((CustomUserDetails)SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
        return this.reservationService.getReservationsByUserAndChildAndFromDate(dateString, childId , userId);
    }
}
