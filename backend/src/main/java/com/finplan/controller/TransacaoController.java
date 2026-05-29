package com.finplan.controller;

import com.finplan.model.Transacao;
import com.finplan.service.TransacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transacoes")
@CrossOrigin(origins = "*")
public class TransacaoController {
    
    @Autowired
    private TransacaoService service;
    
    @GetMapping
    public ResponseEntity<List<Transacao>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Transacao> getById(@PathVariable Long id) {
        Transacao transacao = service.findById(id);
        return transacao != null ? ResponseEntity.ok(transacao) : ResponseEntity.notFound().build();
    }
    
    @PostMapping
    public ResponseEntity<Transacao> create(@RequestBody Transacao transacao) {
        Transacao saved = service.save(transacao);
        return ResponseEntity.ok(saved);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Transacao> update(@PathVariable Long id, @RequestBody Transacao transacao) {
        Transacao existing = service.findById(id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        transacao.setId(id);
        return ResponseEntity.ok(service.save(transacao));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/resumo")
    public ResponseEntity<Map<String, Object>> getResumo(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fim) {
        
        Map<String, Object> resumo = new HashMap<>();
        resumo.put("totalReceitas", service.getTotalReceitas(inicio, fim));
        resumo.put("totalDespesas", service.getTotalDespesas(inicio, fim));
        resumo.put("despesasPorCategoria", service.getDespesasPorCategoria());
        
        return ResponseEntity.ok(resumo);
    }
    
    @GetMapping("/ultimas")
    public ResponseEntity<List<Transacao>> getUltimas() {
        return ResponseEntity.ok(service.getUltimasTransacoes());
    }
}
