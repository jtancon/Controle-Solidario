package com.example.controle.controller

import com.example.controle.model.Users
import com.example.controle.service.FirebaseService
import com.google.cloud.firestore.Firestore
import org.springframework.stereotype.Controller

@Controller
class UsersController {

    private val firestore: Firestore = FirebaseService().firestore
    private val collectionName = "usuarios"

    fun inserirUsuario(usuario: Users): Pair<Boolean, String> {
        return try {
            val docId = if (usuario.uid.isNotBlank()) usuario.uid else usuario.email
            firestore.collection(collectionName).document(docId).set(usuario).get()
            Pair(true, docId)
        } catch (e: Exception) {
            Pair(false, e.message ?: "Erro desconhecido")
        }
    }

    fun listarTodosUsuarios(): List<Users> {
        return try {
            val snapshot = firestore.collection(collectionName).get().get()
            snapshot.documents.mapNotNull { it.toObject(Users::class.java) }
        } catch (e: Exception) {
            emptyList()
        }
    }

    fun atualizarUsuario(id: String, usuario: Users): Boolean {
        return try {
            firestore.collection(collectionName).document(id).set(usuario.copy(uid = id)).get()
            true
        } catch (e: Exception) {
            false
        }
    }

    fun deletarUsuario(id: String): Boolean {
        return try {
            firestore.collection(collectionName).document(id).delete().get()
            true
        } catch (e: Exception) {
            false
        }
    }
}
