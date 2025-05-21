package com.example.controle.controller

import com.example.controle.model.Usuario
import com.example.controle.service.FirebaseService
import com.google.cloud.firestore.Firestore

class UsuarioController(private val firebaseService: FirebaseService) {

    private val firestore: Firestore = firebaseService.firestore
    private val colecao = firestore.collection("usuarios")

    fun inserirUsuario(usuario: Usuario) {
        try {
            colecao.add(usuario).get()
            println("✅ Usuário inserido com sucesso!")
        } catch (e: Exception) {
            println("❌ Erro ao inserir usuário: ${e.message}")
        }
    }

    fun listarTodosUsuarios(): List<Pair<String, Usuario>> {
        return try {
            val snapshot = colecao.get().get()
            snapshot.documents.mapNotNull { doc ->
                val usuario = doc.toObject(Usuario::class.java)
                if (usuario != null) Pair(doc.id, usuario) else null
            }
        } catch (e: Exception) {
            println("❌ Erro ao listar usuários: ${e.message}")
            emptyList()
        }
    }

    fun atualizarUsuario(id: String, usuario: Usuario) {
        try {
            colecao.document(id).set(usuario).get()
            println("✅ Usuário atualizado com sucesso!")
        } catch (e: Exception) {
            println("❌ Erro ao atualizar usuário: ${e.message}")
        }
    }

    fun deletarUsuario(id: String) {
        try {
            colecao.document(id).delete().get()
            println("✅ Usuário deletado com sucesso!")
        } catch (e: Exception) {
            println("❌ Erro ao deletar usuário: ${e.message}")
        }
    }
}
