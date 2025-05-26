package com.example.controle.rest

import com.example.controle.controller.DoacaoController
import com.example.controle.model.Doacao
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/doacoes")
@CrossOrigin(origins = ["http://localhost:3000"]) // ajuste se necessário
class DoacaoRestController(
    private val doacaoController: DoacaoController
) {

    @PostMapping
    fun criarDoacao(@RequestBody doacao: Doacao): ResponseEntity<Any> {
        val (sucesso, resultado) = doacaoController.inserirDoacao(doacao)
        return if (sucesso)
            ResponseEntity.ok(mapOf("message" to "✅ Doação registrada", "id" to resultado))
        else
            ResponseEntity.internalServerError().body(mapOf("error" to resultado))
    }

    @GetMapping
    fun listarDoacoes(): ResponseEntity<Any> {
        val doacoes = doacaoController.listarTodasDoacoes()
        return ResponseEntity.ok(doacoes)
    }

    @DeleteMapping("/{id}")
    fun deletarDoacao(@PathVariable id: String): ResponseEntity<String> {
        return if (doacaoController.deletarDoacao(id))
            ResponseEntity.ok("🗑️ Doação deletada com sucesso")
        else
            ResponseEntity.internalServerError().body("❌ Erro ao deletar doação")
    }
}
