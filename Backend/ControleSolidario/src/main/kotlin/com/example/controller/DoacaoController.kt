package com.example.controle.controller

import com.example.controle.model.Doacao
import com.example.controle.service.FirebaseService
import com.google.cloud.firestore.SetOptions

class DoacaoController(firebaseService: FirebaseService) {

    private val firestore = firebaseService.firestore
    private val colecao = firestore.collection("doacao")

    fun inserirDoacao(doacao: Doacao): Boolean {
        return try {
            val result = colecao.add(doacao).get()
            println("✅ Doação enviada com sucesso!")
            println("🆔 ID do documento: ${result.id}")
            println("📦 Conteúdo enviado: $doacao")
            true
        } catch (e: Exception) {
            println("❌ Erro ao enviar doação: ${e.message}")
            false
        }
    }

    fun listarTodasDoacoes(): List<Pair<String, Doacao>> {
        return try {
            val snapshot = colecao.get().get()
            snapshot.documents.mapNotNull { doc ->
                val doacao = doc.toObject(Doacao::class.java)
                if (doacao != null) Pair(doc.id, doacao) else null
            }
        } catch (e: Exception) {
            println("❌ Erro ao buscar doações: ${e.message}")
            emptyList()
        }
    }

    fun atualizarDoacao(id: String, novaDoacao: Doacao): Boolean {
        return try {
            colecao.document(id).set(novaDoacao, SetOptions.merge()).get()
            println("✅ Doação atualizada com sucesso!")
            true
        } catch (e: Exception) {
            println("❌ Erro ao atualizar doação: ${e.message}")
            false
        }
    }

    fun deletarDoacao(id: String): Boolean {
        return try {
            colecao.document(id).delete().get()
            println("🗑️ Doação deletada com sucesso!")
            true
        } catch (e: Exception) {
            println("❌ Erro ao deletar doação: ${e.message}")
            false
        }
    }
}
