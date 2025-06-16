package com.example.controle.controller
import com.example.controle.model.Users
import com.example.controle.service.FirebaseService
import com.google.cloud.firestore.Firestore
import org.springframework.stereotype.Controller
// ✅ ADICIONE ESTAS IMPORTAÇÕES PARA LOGGING
import java.util.logging.Level
import java.util.logging.Logger

@Controller
class UsersController {

    private val firestore: Firestore = FirebaseService().firestore
    private val collectionName = "usuarios"
    // ✅ ADICIONE A DECLARAÇÃO DO LOGGER
    private val logger: Logger = Logger.getLogger(UsersController::class.java.name)

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

    // ✅ FUNÇÃO CORRIGIDA COM LOGS DETALHADOS
    fun listarTodosUsuarios(): List<Users> {
        logger.info("Tentando buscar todos os documentos da coleção '$collectionName'.")
        return try {
            val snapshot = firestore.collection(collectionName).get().get()

            if (snapshot.isEmpty) {
                logger.warning("A consulta ao Firestore foi bem-sucedida, mas a coleção '$collectionName' está vazia.")
                return emptyList()
            }

            logger.info("Encontrados ${snapshot.size()} documentos. Mapeando para objetos Users...")

            val usuarios = snapshot.documents.mapNotNull { documento ->
                try {
                    // Tenta converter cada documento para um objeto Users
                    documento.toObject(Users::class.java)
                } catch (e: Exception) {
                    // Se a conversão falhar, este log informará QUAL documento tem problema.
                    logger.log(Level.SEVERE, "FALHA AO CONVERTER DOCUMENTO! ID: ${documento.id}. Verifique se todos os campos deste documento correspondem à classe 'Users' em Kotlin.", e)
                    null // Retorna nulo para este item, para que ele seja descartado da lista final.
                }
            }

            logger.info("Mapeamento concluído. ${usuarios.size} de ${snapshot.size()} documentos foram convertidos com sucesso.")
            usuarios

        } catch (e: Exception) {
            // Este log captura erros críticos como falha de conexão ou problemas de permissão.
            logger.log(Level.SEVERE, "ERRO CRÍTICO AO ACESSAR O FIRESTORE! Verifique as credenciais do servidor e as regras de segurança do banco de dados.", e)
            emptyList() // Retorna uma lista vazia para não quebrar o frontend.
        }
    }

    fun buscarUsuarioPorEmail(email: String): Users? {
        return try {
            val querySnapshot = firestore.collection(collectionName)
                .whereEqualTo("email", email)
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

    fun atualizarUsuario(uid: String, dadosParaAtualizar: Map<String, Any>): Boolean {
        return try {
            // Validação para garantir que o email e o uid não estão a ser alterados no mapa
            val dadosModificaveis = dadosParaAtualizar.toMutableMap()
            dadosModificaveis.remove("email")
            dadosModificaveis.remove("uid")

            logger.info("A atualizar o documento com UID: $uid")
            firestore.collection(collectionName).document(uid).update(dadosModificaveis).get()
            true
        } catch (e: Exception) {
            logger.log(Level.SEVERE, "Erro ao atualizar o usuário com UID: $uid", e)
            false
        }
    }

    // ✅ FUNÇÃO CORRIGIDA: Agora recebe o uid para apagar o documento correto.
    fun deletarUsuario(uid: String): Boolean {
        logger.info("Tentando apagar o usuário com UID: $uid")
        return try {
            firestore.collection(collectionName).document(uid).delete().get()
            logger.info("Usuário com UID $uid apagado com sucesso do Firestore.")
            true
        } catch (e: Exception) {
            logger.log(Level.SEVERE, "Erro ao apagar o usuário com UID: $uid", e)
            false
        }
    }
}
