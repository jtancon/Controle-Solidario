package com.example.controle.controller

import com.example.controle.model.Acao
import com.example.controle.service.FirebaseService
import com.google.firebase.cloud.FirestoreClient

class AcaoController(firebaseService: FirebaseService) {

    private val firestore = firebaseService.firestore

    fun inserirAcao(acao: Acao): Boolean {
        return try {
            val result = firestore.collection("acoes").add(acao).get()
            println("✅ Ação registrada com sucesso!")
            println("🆔 ID do documento: ${result.id}")
            println("📦 Conteúdo: $acao")
            true
        } catch (e: Exception) {
            println("❌ Erro ao registrar ação: ${e.message}")
            false
        }
    }

    fun listarTodasAcoes(): List<Pair<String, Acao>> {
        return try {
            val snapshot = firestore.collection("acoes").get().get()
            snapshot.documents.mapNotNull { doc ->
                val acao = doc.toObject(Acao::class.java)
                if (acao != null) Pair(doc.id, acao) else null
            }
        } catch (e: Exception) {
            println("❌ Erro ao listar ações: ${e.message}")
            emptyList()
        }
    }

    fun atualizarAcao(id: String, novaAcao: Acao): Boolean {
        return try {
            firestore.collection("acoes").document(id).set(novaAcao).get()
            println("✅ Ação atualizada com sucesso!")
            true
        } catch (e: Exception) {
            println("❌ Erro ao atualizar ação: ${e.message}")
            false
        }
    }

    fun deletarAcao(id: String): Boolean {
        return try {
            firestore.collection("acoes").document(id).delete().get()
            println("🗑️ Ação excluída com sucesso!")
            true
        } catch (e: Exception) {
            println("❌ Erro ao deletar ação: ${e.message}")
            false
        }
    }
}
