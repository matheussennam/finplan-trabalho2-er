package com.finplan.service;

import com.finplan.model.Transacao;
import com.finplan.repository.TransacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class TransacaoService {
    
    @Autowired
    private TransacaoRepository repository;
    
    public List<Transacao> findAll() {
        return repository.findAll();
    }
    
    public Transacao findById(Long id) {
        return repository.findById(id).orElse(null);
    }
    
    public Transacao save(Transacao transacao) {
        return repository.save(transacao);
    }
    
    public void delete(Long id) {
        repository.deleteById(id);
    }
    
    public List<Transacao> findByPeriodo(LocalDate inicio, LocalDate fim) {
        return repository.findByDataBetween(inicio, fim);
    }
    
    public BigDecimal getTotalReceitas(LocalDate inicio, LocalDate fim) {
        BigDecimal total = repository.getTotalPorTipoNoPeriodo(Transacao.TipoTransacao.RECEITA, inicio, fim);
        return total != null ? total : BigDecimal.ZERO;
    }
    
    public BigDecimal getTotalDespesas(LocalDate inicio, LocalDate fim) {
        BigDecimal total = repository.getTotalPorTipoNoPeriodo(Transacao.TipoTransacao.DESPESA, inicio, fim);
        return total != null ? total : BigDecimal.ZERO;
    }
    
    public Map<String, BigDecimal> getDespesasPorCategoria() {
        Map<String, BigDecimal> mapa = new HashMap<>();
        List<Object[]> resultados = repository.getTotalDespesasPorCategoria();
        
        for (Object[] resultado : resultados) {
            String categoria = (String) resultado[0];
            BigDecimal valor = (BigDecimal) resultado[1];
            mapa.put(categoria, valor);
        }
        
        return mapa;
    }
    
    public List<Transacao> getUltimasTransacoes() {
        return repository.findTop10ByOrderByDataDesc();
    }
}
