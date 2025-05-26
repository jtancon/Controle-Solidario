package com.example.controle.model

import com.google.cloud.Timestamp

data class Doacao(
    val id: String = "",
    val data: Timestamp? = null,
    val idDoador: String = "",
    val idOng: String = "",
    val valor: Double = 0.0,
    val descricao: String = "",
    val tipo: String = ""
)
