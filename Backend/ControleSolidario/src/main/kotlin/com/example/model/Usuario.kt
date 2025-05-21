package com.example.controle.model

import java.util.*

data class Usuario(
    val uid: String = "",
    val nome: String = "",
    val nomeCompleto: String = "",
    val nomeUsuario: String = "",
    val cpf: String = "",
    val cnpj: String = "",
    val cep: String = "",
    val endereco: String = "",
    val telefone: String = "",
    val email: String = "",
    val descricao: String = "",
    val representante: String = "",
    val classificacao: String = "",
    val fotoPerfil: String = "",
    val criadoEm: Date? = null
)
