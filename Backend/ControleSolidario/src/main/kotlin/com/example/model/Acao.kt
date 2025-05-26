package com.example.controle.model

import com.google.cloud.Timestamp

data class Acao(
    val id: String? = null,
    val Titulo: String = "",
    val Descricao: String = "",
    val IdOng: String = "",
    val Status: String = "Planejada",
    val DataInicio: Timestamp? = null,
    val DataFim: Timestamp? = null
)
