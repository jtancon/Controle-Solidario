package com.example.controle.rest

import com.example.controle.controller.AcaoController
import com.example.controle.model.Acao
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/acoes")
@CrossOrigin(origins = ["http://localhost:3000"]) // ajuste conforme seu frontend
class AcaoRestController(
    private val acaoController: AcaoController
) {

    @PostMapping
    fun criarAcao(@RequestBody acao: Acao): ResponseEntity<Any> {
        val (sucesso, resultado) = acaoController.inserirAcao(acao)
        return if (sucesso)
            ResponseEntity.ok(mapOf("message" to "✅ Ação criada", "id" to resultado))
        else
            ResponseEntity.internalServerError().body(mapOf("error" to resultado))
    }

    @GetMapping
    fun listarAcoes(): ResponseEntity<Any> {
        val acoes = acaoController.listarTodasAcoes()
        return ResponseEntity.ok(acoes)
    }

    @PutMapping("/{id}")
    fun atualizarAcao(@PathVariable id: String, @RequestBody acao: Acao): ResponseEntity<String> {
        return if (acaoController.atualizarAcao(id, acao))
            ResponseEntity.ok("✅ Ação atualizada com sucesso")
        else
            ResponseEntity.internalServerError().body("❌ Erro ao atualizar ação")
    }

    @DeleteMapping("/{id}")
    fun deletarAcao(@PathVariable id: String): ResponseEntity<String> {
        return if (acaoController.deletarAcao(id))
            ResponseEntity.ok("🗑️ Ação excluída com sucesso")
        else
            ResponseEntity.internalServerError().body("❌ Erro ao excluir ação")
    }
}