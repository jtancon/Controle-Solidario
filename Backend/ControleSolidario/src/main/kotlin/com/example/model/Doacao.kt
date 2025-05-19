package com.example.controle.model

import java.util.*

data class Doacao(
    var data: Date? = null,
    var idDoador: String = "",
    var idOng: String = "",
    var valor: Double = 0.0,
    var descricao: String = "",
    var tipo: String = ""
)
