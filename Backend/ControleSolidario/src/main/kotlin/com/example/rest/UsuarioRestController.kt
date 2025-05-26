package com.example.controle.rest

import com.example.controle.controller.UsersController
import com.example.controle.model.Users
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = ["http://localhost:3000"]) // Libera o frontend React local
class UsuarioRestController(
    private val usersController: UsersController
) {

    @PostMapping
    fun criarUsuario(@RequestBody usuario: Users): ResponseEntity<Any> {
        val (sucesso, resultado) = usersController.inserirUsuario(usuario)
        return if (sucesso)
            ResponseEntity.ok(mapOf("message" to "✅ Usuário criado com sucesso", "id" to resultado))
        else
            ResponseEntity.internalServerError().body(mapOf("error" to resultado))
    }

    @GetMapping
    fun listarUsuarios(): ResponseEntity<Any> {
        return try {
            val usuarios = usersController.listarTodosUsuarios()
            ResponseEntity.ok(usuarios)
        } catch (e: Exception) {
            ResponseEntity.internalServerError().body(mapOf("error" to e.message))
        }
    }

    @PutMapping("/{id}")
    fun atualizarUsuario(@PathVariable id: String, @RequestBody usuario: Users): ResponseEntity<String> {
        return if (usersController.atualizarUsuario(id, usuario))
            ResponseEntity.ok("✅ Usuário atualizado com sucesso")
        else
            ResponseEntity.internalServerError().body("❌ Erro ao atualizar usuário")
    }

    @DeleteMapping("/{id}")
    fun deletarUsuario(@PathVariable id: String): ResponseEntity<String> {
        return if (usersController.deletarUsuario(id))
            ResponseEntity.ok("🗑️ Usuário deletado com sucesso")
        else
            ResponseEntity.internalServerError().body("❌ Erro ao deletar usuário")
    }
}
