package com.exemplo.controller

import com.exemplo.model.Ong
import com.exemplo.repository.OngRepository
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/ongs")
@CrossOrigin(origins = ["http://localhost:3000"])
class OngController(val repository: OngRepository) {

    @PostMapping
    fun cadastrar(@RequestBody ong: Ong): ResponseEntity<String> {
        repository.save(ong)
        return ResponseEntity.ok("ONG cadastrada com sucesso!")
    }

    @GetMapping
    fun listar(): List<Ong> = repository.findAll()
}
