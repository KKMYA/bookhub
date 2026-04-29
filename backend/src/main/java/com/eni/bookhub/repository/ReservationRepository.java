package com.eni.bookhub.repository;

import com.eni.bookhub.bo.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByAccountIdAccountOrderByDateReservationDesc(Long idAccount);

    List<Reservation> findByStatutOrderByDateReservationDesc(String statut);

    List<Reservation> findByBookIdBookOrderByRangFileAttenteAsc(Integer idBook);

    boolean existsByBookIdBookAndAccountIdAccountAndStatutIn(
            Integer idBook,
            Long idAccount,
            Collection<String> statuts
    );

    @Query("SELECT COALESCE(MAX(r.rangFileAttente), 0) FROM Reservation r WHERE r.book.idBook = :idBook")
    Integer findMaxQueueRankByBookId(@Param("idBook") Integer idBook);

    Reservation findByBookIdBookAndStatutAndAccountIdAccount(Integer idBook, String statut, Long idAccount);
}
