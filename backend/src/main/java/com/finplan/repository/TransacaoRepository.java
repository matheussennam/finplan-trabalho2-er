package com.finplan.repository;

import com.finplan.model.Transacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransacaoRepository extends JpaRepository<Transacao, Long> {
    
    List<Transacao> findByTipo(Transacao.TipoTransacao tipo);
    
    List<Transacao> findByDataBetween(LocalDate inicio, LocalDate fim);
    
    List<Transacao> findByCategoria(String categoria);
    
    @Query("SELECT SUM(t.valor) FROM Transacao t WHERE t.tipo = :tipo AND t.data BETWEEN :inicio AND :fim")
    BigDecimal getTotalPorTipoNoPeriodo(@Param("tipo") Transacao.TipoTransacao tipo,
                                        @Param("inicio") LocalDate inicio,
                                        @Param("fim") LocalDate fim);
    
    @Query("SELECT t.categoria, SUM(t.valor) FROM Transacao t WHERE t.tipo = 'DESPESA' GROUP BY t.categoria")
    List<Object[]> getTotalDespesasPorCategoria();
    
    List<Transacao> findTop10ByOrderByDataDesc();
}
