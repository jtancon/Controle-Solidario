package com.example.controle.model

import java.util.*

data class Acao(
    val titulo: String = "",
    val descricao: String = "",
    val idOng: String = "",
    val status: String = "",
    val dataInicio: Date? = null,
    val dataFim: Date? = null
)
