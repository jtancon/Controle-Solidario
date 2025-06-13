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
            require(usuario.email.isNotBlank()) { "O e-mail não pode ser vazio." }
            val docId = usuario.email
            firestore.collection(collectionName).document(docId).set(usuario).get()
            Pair(true, docId)
        } catch (e: Exception) {
            Pair(false, e.message ?: "Erro desconhecido ao inserir usuário.")
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

    fun buscarUsuarioPorEmail(email: String): Users? {
        return try {
            val querySnapshot = firestore.collection(collectionName)
                .whereEqualTo("email", email) // Filtra pelo campo 'email'
                .limit(1)                     // Pega apenas o primeiro resultado correspondente
                .get()
                .get()

            if (!querySnapshot.isEmpty) {
                // Se encontrar um documento, converte-o para o objeto Users
                querySnapshot.documents.first().toObject(Users::class.java)
            } else {
                // Retorna nulo se nenhum documento for encontrado com aquele email
                null
            }
        } catch (e: Exception) {
            // Em caso de erro na consulta, retorna nulo para evitar quebrar o app
            null
        }
    }

    fun buscarUsuarioPorNome(nome: String): Users? {
        return try {
            val querySnapshot = firestore.collection(collectionName)
                .whereEqualTo("nome", nome)
                .limit(1)
                .get()
                .get()

            if (!querySnapshot.isEmpty) {
                querySnapshot.documents.first().toObject(Users::class.java)
            } else {
                null
            }
        } catch (e: Exception) {
            null
        }
    }

    fun atualizarUsuario(email: String, usuario: Users): Boolean {
        return try {
            firestore.collection(collectionName).document(email).set(usuario.copy(email = email)).get()
            true
        } catch (e: Exception) {
            false
        }
    }

    fun deletarUsuario(email: String): Boolean {
        return try {
            firestore.collection(collectionName).document(email).delete().get()
            true
        } catch (e: Exception) {
            false
        }
    }
}
