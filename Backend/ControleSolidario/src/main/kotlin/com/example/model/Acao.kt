package com.example.controle.model

import com.google.cloud.Timestamp

data class Acao(
    val id: String = "",
    val titulo: String = "",
    val descricao: String = "",
    val status: String = "",          // Planejada, Em andamento, etc
    val dataInicio: Timestamp? = null,
    val dataFim: Timestamp? = null,
    val idOng: String = ""            // <- esse campo é essencial
)

