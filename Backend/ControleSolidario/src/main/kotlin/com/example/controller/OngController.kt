package com.exemplo.controller

import com.exemplo.model.Ong
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/ongs")
@CrossOrigin(origins = ["http://localhost:3000"]) // React dev server
class OngController {

    @PostMapping
    fun cadastrar(@RequestBody ong: Ong): ResponseEntity<String> {
        println("Recebido: $ong")
        return ResponseEntity.ok("ONG cadastrada com sucesso!")
    }
}