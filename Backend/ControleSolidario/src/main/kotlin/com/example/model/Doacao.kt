package com.example.ControleSolidario.model

data class Doacao(
    val ID: Int,
    val DoadorID: String,
    val OngID: String,
    val Valor: String,
    val Data: String,
    val Descricao: String,
    val Tipo: String
)
