package com.finplan.repository;

import com.finplan.model.MetaFinanceira;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MetaFinanceiraRepository extends JpaRepository<MetaFinanceira, Long> {
    
    List<MetaFinanceira> findByDataFimAfter(LocalDate data);
    
    List<MetaFinanceira> findByDataInicioBeforeAndDataFimAfter(LocalDate inicio, LocalDate fim);
}
