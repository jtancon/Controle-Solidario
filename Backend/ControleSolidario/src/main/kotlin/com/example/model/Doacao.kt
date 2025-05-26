package com.example.controle.model

data class Doacao(
    val id: String = "",           // adicionado para mapear o doc.id
    val Data: Long? = null,        // timestamp em milissegundos
    val IdDoador: String = "",
    val IdOng: String = "",
    val Valor: Double = 0.0,
    val descricao: String = "",
    val tipo: String = ""          // "Pix", "Cartão", "Boleto", etc.
)
