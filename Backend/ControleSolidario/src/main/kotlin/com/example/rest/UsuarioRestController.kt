package com.example.controle.rest

import com.example.controle.controller.UsersController
import com.example.controle.model.Users
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = ["http://localhost:3000", "http://localhost:5173"]) // Adicionada a porta do Vite
class UsuarioRestController(
    private val usersController: UsersController
) {

    @PostMapping
    fun criarUsuario(@RequestBody usuario: Users): ResponseEntity<Any> {
        val (sucesso, resultado) = usersController.inserirUsuario(usuario)
        return if (sucesso)
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
            // Esta captura de erro é uma segurança extra, mas o erro principal será logado no controller.
            ResponseEntity.internalServerError().body(mapOf("error" to e.message))
        }
    }


    /**
     * Endpoint que busca um usuário pelo seu email.
     * Agora chama o método correto no controller que busca pelo CAMPO 'email'.
     */
    @GetMapping("/{email}")
    fun buscarUsuarioPorEmail(@PathVariable email: String): ResponseEntity<Any> {
        // ✅ CORRIGIDO: Chama o método com o nome correto.
        val usuario = usersController.buscarUsuarioPorEmail(email)

        return if (usuario != null)
            ResponseEntity.ok(usuario)
        else
            ResponseEntity.notFound().build()
    }

    /**
     * Endpoint que busca pelo nome do usuário/ONG.
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

    /**
     * Endpoint para atualizar um usuário, identificado pelo seu email.
     */
    @PutMapping("/{uid}")
    fun atualizarUsuario(@PathVariable uid: String, @RequestBody dados: Map<String, Any>): ResponseEntity<Map<String, String>> {
        return if (usersController.atualizarUsuario(uid, dados)) {
            ResponseEntity.ok(mapOf("message" to "Usuário atualizado com sucesso"))
        } else {
            ResponseEntity
                .status(500)
                .body(mapOf("error" to "Ocorreu um erro no servidor ao tentar atualizar o usuário."))
        }
    }

    // O seu endpoint de apagar (@DeleteMapping) está bom como está.
    @DeleteMapping("/{uid}")
    fun deletarUsuario(@PathVariable uid: String): ResponseEntity<String> {
        return if (usersController.deletarUsuario(uid))
            ResponseEntity.ok("🗑️ Usuário apagado com sucesso do Firestore")
        else
            ResponseEntity.internalServerError().body("❌ Erro ao apagar usuário do Firestore")
    }
}