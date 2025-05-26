package com.example.controle.controller

import com.example.controle.model.Doacao
import com.example.controle.service.FirebaseService
import com.google.cloud.firestore.Firestore
import org.springframework.stereotype.Controller

@Controller
class DoacaoController {

    private val firestore: Firestore = FirebaseService().firestore
    private val collectionName = "doacao"

    fun inserirDoacao(doacao: Doacao): Pair<Boolean, String> {
        return try {
            val docRef = firestore.collection(collectionName).document()
            docRef.set(doacao.copy(id = docRef.id)).get()
            Pair(true, docRef.id)
        } catch (e: Exception) {
            Pair(false, e.message ?: "Erro ao registrar doação")
        }
    }

    fun listarTodasDoacoes(): List<Doacao> {
        println("🚨 Método listarTodasDoacoes foi chamado") // <-- debug
        return try {
            val snapshot = firestore.collection(collectionName).get().get()
            snapshot.documents.mapNotNull { it.toObject(Doacao::class.java)?.copy(id = it.id) }
        } catch (e: Exception) {
            println("❌ Erro ao listar doações: ${e.message}") // <-- debug erro
            emptyList()
        }
    }

    fun atualizarDoacao(id: String, doacao: Doacao): Boolean {
        return try {
            firestore.collection(collectionName).document(id).set(doacao.copy(id = id)).get()
            true
        } catch (e: Exception) {
            false
        }
    }

    fun deletarDoacao(id: String): Boolean {
        return try {
            firestore.collection(collectionName).document(id).delete().get()
            true
        } catch (e: Exception) {
            false
        }
    }
}
