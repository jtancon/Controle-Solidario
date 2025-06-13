package com.example.controle.controller

import com.example.controle.model.Doacao
import com.example.controle.service.FirebaseService
import com.google.cloud.firestore.Firestore
import org.springframework.stereotype.Controller
import com.google.cloud.Timestamp

@Controller
class DoacaoController {

    private val firestore: Firestore = FirebaseService().firestore
    private val collectionName = "doacao"

    /**
     * Insere uma nova doação, gerando um ID e data de criação automaticamente.
     */
    fun inserirDoacao(doacao: Doacao): Pair<Boolean, String> {
        return try {
            val docRef = firestore.collection(collectionName).document()
            val novaDoacao = doacao.copy(id = docRef.id, data = Timestamp.now())
            docRef.set(novaDoacao).get()
            Pair(true, docRef.id)
        } catch (e: Exception) {
            Pair(false, e.message ?: "Erro ao inserir doação")
        }
    }

    /**
     * ✅ NOVO: Busca doações de um doador específico de forma eficiente.
     * Usa uma consulta 'whereEqualTo' para filtrar diretamente no Firestore.
     */
    fun listarDoacoesPorDoador(idDoador: String): List<Doacao> {
        return try {
            val snapshot = firestore.collection(collectionName)
                .whereEqualTo("idDoador", idDoador) // Filtro direto no banco de dados
                .get()
                .get()
            snapshot.documents.mapNotNull { it.toObject(Doacao::class.java)?.copy(id = it.id) }
        } catch (e: Exception) {
            emptyList()
        }
    }

    /**
     * ✅ NOVO: Busca doações para uma ONG específica de forma eficiente.
     * Usa uma consulta 'whereEqualTo' para filtrar diretamente no Firestore.
     */
    fun listarDoacoesPorOng(idOng: String): List<Doacao> {
        return try {
            val snapshot = firestore.collection(collectionName)
                .whereEqualTo("idOng", idOng) // Filtro direto no banco de dados
                .get()
                .get()
            snapshot.documents.mapNotNull { it.toObject(Doacao::class.java)?.copy(id = it.id) }
        } catch (e: Exception) {
            emptyList()
        }
    }

    /**
     * Lista todas as doações existentes. Útil para fins administrativos.
     */
    fun listarTodasDoacoes(): List<Doacao> {
        return try {
            val snapshot = firestore.collection(collectionName).get().get()
            snapshot.documents.mapNotNull { it.toObject(Doacao::class.java)?.copy(id = it.id) }
        } catch (e: Exception) {
            emptyList()
        }
    }

    /**
     * Deleta uma doação específica pelo seu ID.
     */
    fun deletarDoacao(id: String): Boolean {
        return try {
            firestore.collection(collectionName).document(id).delete().get()
            true
        } catch (e: Exception) {
            false
        }
    }
}