package com.example.controle.model

import com.google.cloud.Timestamp

data class Doacao(
    val id: String = "",
    val Data: Timestamp? = null,         // ✔ correto
    val IdDoador: String = "",           // ✔ correto
    val IdOng: String = "",              // ✔ correto
    val Valor: Double = 0.0,             // ✔ correto
    val descricao: String = "",
    val tipo: String = ""
)

