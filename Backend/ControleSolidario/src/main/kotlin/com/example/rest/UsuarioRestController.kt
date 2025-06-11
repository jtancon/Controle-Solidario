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
        // Alterado de "id" para "email" para maior clareza na resposta da API.
            ResponseEntity.ok(mapOf("message" to "✅ Usuário criado com sucesso", "email" to resultado))
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

    // Endpoint que busca por email (ID do documento)
    @GetMapping("/{email}")
    fun buscarUsuarioPorEmail(@PathVariable email: String): ResponseEntity<Any> {
        val usuario = usersController.buscarUsuarioPorEmail(email)
        return if (usuario != null)
            ResponseEntity.ok(usuario)
        else
            ResponseEntity.notFound().build()
    }

    /**
     * ✅ NOVO: Endpoint que busca pelo nome do usuário/ONG.
     * A URL é diferente para não conflitar com a busca por email.
     */
    @GetMapping("/by-name/{nome}")
    fun buscarUsuarioPorNome(@PathVariable nome: String): ResponseEntity<Any> {
        val usuario = usersController.buscarUsuarioPorNome(nome)
        return if (usuario != null) {
            ResponseEntity.ok(usuario)
        } else {
            ResponseEntity.notFound().build()
        }
    }

    // O endpoint agora espera um email para saber qual usuário atualizar.
    @PutMapping("/{email}")
    fun atualizarUsuario(@PathVariable email: String, @RequestBody usuario: Users): ResponseEntity<String> {
        return if (usersController.atualizarUsuario(email, usuario))
            ResponseEntity.ok("✅ Usuário atualizado com sucesso")
        else
            ResponseEntity.internalServerError().body("❌ Erro ao atualizar usuário")
    }

    // O endpoint agora espera um email para saber qual usuário deletar.
    @DeleteMapping("/{email}")
    fun deletarUsuario(@PathVariable email: String): ResponseEntity<String> {
        // Passa o email para o método de deleção do controller.
        return if (usersController.deletarUsuario(email))
            ResponseEntity.ok("🗑️ Usuário deletado com sucesso")
        else
            ResponseEntity.internalServerError().body("❌ Erro ao deletar usuário")
    }
}
