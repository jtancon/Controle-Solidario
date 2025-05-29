package com.example.controle.controller

import com.example.controle.model.Acao
import com.example.controle.service.FirebaseService
import com.google.cloud.firestore.Firestore
import org.springframework.stereotype.Controller

@Controller
class AcaoController {

    private val firestore: Firestore = FirebaseService().firestore
    private val collectionName = "acoes"

    fun inserirAcao(acao: Acao): Pair<Boolean, String> {
        return try {
            val docRef = firestore.collection(collectionName).document()
            docRef.set(acao.copy(id = docRef.id)).get()
            Pair(true, docRef.id)
        } catch (e: Exception) {
            Pair(false, e.message ?: "Erro ao inserir ação")
        }
    }

    fun listarTodasAcoes(): List<Acao> {
        return try {
            val snapshot = firestore.collection(collectionName).get().get()
            snapshot.documents.mapNotNull { it.toObject(Acao::class.java)?.copy(id = it.id) }
        } catch (e: Exception) {
            emptyList()
        }
    }

    fun atualizarAcao(id: String, acao: Acao): Boolean {
        return try {
            firestore.collection(collectionName).document(id).set(acao.copy(id = id)).get()
            true
        } catch (e: Exception) {
            false
        }
    }

    fun deletarAcao(id: String): Boolean {
        return try {
            firestore.collection(collectionName).document(id).delete().get()
            true
        } catch (e: Exception) {
            false
        }
    }
}
