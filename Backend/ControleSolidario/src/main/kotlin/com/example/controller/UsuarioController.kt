package com.example.controle.controller
import com.example.controle.model.Users
import com.example.controle.service.FirebaseService
import com.google.cloud.firestore.Firestore
import org.springframework.stereotype.Controller

@Controller
class UsersController {

    private val firestore: Firestore = FirebaseService().firestore
    private val collectionName = "usuarios"

    /**
     * Insere um novo usuário usando o email como ID do documento.
     * Garante que o email não seja vazio.
     */
    fun inserirUsuario(usuario: Users): Pair<Boolean, String> {
        return try {
            // Garante que o email existe antes de usá-lo como ID.
            require(usuario.email.isNotBlank()) { "O e-mail não pode ser vazio." }

            val docId = usuario.email // Usa o email diretamente como ID do documento.
            firestore.collection(collectionName).document(docId).set(usuario).get()
            Pair(true, docId) // Retorna o email como o ID de sucesso.
        } catch (e: Exception) {
            Pair(false, e.message ?: "Erro desconhecido ao inserir usuário.")
        }
    }

    /**
     * Lista todos os usuários da coleção.
     * O método toObject já mapeia o campo 'email' do documento para o objeto.
     */
    fun listarTodosUsuarios(): List<Users> {
        return try {
            val snapshot = firestore.collection(collectionName).get().get()
            snapshot.documents.mapNotNull { it.toObject(Users::class.java) }
        } catch (e: Exception) {
            // Em caso de erro, retorna uma lista vazia.
            emptyList()
        }
    }

    /**
     * Busca um usuário específico pelo seu email.
     */
    fun buscarUsuarioPorEmail(email: String): Users? {
        return try {
            val doc = firestore.collection(collectionName).document(email).get().get()
            // toObject(Users::class.java) já preenche o campo 'email' se ele existir no documento.
            // A cópia não é mais necessária se o email já é um campo do objeto salvo.
            doc.toObject(Users::class.java)
        } catch (e: Exception) {
            null
        }
    }

    /**
     * Atualiza os dados de um usuário, identificado pelo seu email.
     */
    fun atualizarUsuario(email: String, usuario: Users): Boolean {
        return try {
            // Garante que o objeto a ser salvo tenha o mesmo email que o identificador do documento.
            firestore.collection(collectionName).document(email).set(usuario.copy(email = email)).get()
            true
        } catch (e: Exception) {
            false
        }
    }

    /**
     * Deleta um usuário, identificado pelo seu email.
     */
    fun deletarUsuario(email: String): Boolean {
        return try {
            firestore.collection(collectionName).document(email).delete().get()
            true
        } catch (e: Exception) {
            false
        }
    }
}