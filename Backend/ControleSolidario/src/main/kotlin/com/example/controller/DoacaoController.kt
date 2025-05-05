package com.example.ControleSolidario.controller

import com.example.ControleSolidario.model.Doacao
import com.example.ControleSolidario.repository.FirebaseService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/doacoes")
class DoacaoController {

    private val service = FirebaseService()

    @PostMapping
    fun criarDoacao(@RequestBody doacao: Doacao): String {
        return if (service.inserirDoacao(doacao)) {
            "Doação enviada com sucesso!"
        } else {
            "Erro ao enviar doação."
        }
    }
}
