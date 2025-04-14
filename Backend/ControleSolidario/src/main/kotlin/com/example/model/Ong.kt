package com.exemplo.model

import jakarta.persistence.*

@Entity
@Table(name = "ongs")
data class Ong(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    val nome: String,
    val cnpj: String,
    val cep: String,
    val endereco: String,
    val representante: String,
    val telefone: String
)
