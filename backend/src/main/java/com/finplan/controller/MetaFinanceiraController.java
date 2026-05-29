package com.finplan.controller;

import com.finplan.model.MetaFinanceira;
import com.finplan.service.MetaFinanceiraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/metas")
@CrossOrigin(origins = "*")
public class MetaFinanceiraController {
    
    @Autowired
    private MetaFinanceiraService service;
    
    @GetMapping
    public ResponseEntity<List<MetaFinanceira>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<MetaFinanceira> getById(@PathVariable Long id) {
        MetaFinanceira meta = service.findById(id);
        return meta != null ? ResponseEntity.ok(meta) : ResponseEntity.notFound().build();
    }
    
    @PostMapping
    public ResponseEntity<MetaFinanceira> create(@RequestBody MetaFinanceira meta) {
        MetaFinanceira saved = service.save(meta);
        return ResponseEntity.ok(saved);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<MetaFinanceira> update(@PathVariable Long id, @RequestBody MetaFinanceira meta) {
        MetaFinanceira existing = service.findById(id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        meta.setId(id);
        return ResponseEntity.ok(service.save(meta));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/ativas")
    public ResponseEntity<List<MetaFinanceira>> getMetasAtivas() {
        return ResponseEntity.ok(service.getMetasAtivas());
    }
    
    @GetMapping("/resumo")
    public ResponseEntity<Map<String, Object>> getResumoMetas() {
        Map<String, Object> resumo = new HashMap<>();
        resumo.put("totalMetas", service.findAll().size());
        resumo.put("metasConcluidas", service.getMetasConcluidas());
        resumo.put("metasAtivas", service.getMetasAtivas());
        
        return ResponseEntity.ok(resumo);
    }
}
