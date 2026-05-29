package com.finplan.service;

import com.finplan.model.MetaFinanceira;
import com.finplan.repository.MetaFinanceiraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class MetaFinanceiraService {
    
    @Autowired
    private MetaFinanceiraRepository repository;
    
    public List<MetaFinanceira> findAll() {
        return repository.findAll();
    }
    
    public MetaFinanceira findById(Long id) {
        return repository.findById(id).orElse(null);
    }
    
    public MetaFinanceira save(MetaFinanceira meta) {
        return repository.save(meta);
    }
    
    public void delete(Long id) {
        repository.deleteById(id);
    }
    
    public List<MetaFinanceira> getMetasAtivas() {
        return repository.findByDataFimAfter(LocalDate.now());
    }
    
    public long getMetasConcluidas() {
        List<MetaFinanceira> metas = repository.findAll();
        return metas.stream()
                .filter(meta -> meta.getValorAtual().compareTo(meta.getValorAlvo()) >= 0)
                .count();
    }
}
