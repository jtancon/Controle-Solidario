package com.example.controle.model

import com.google.cloud.Timestamp

data class Users(
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
    val criadoEm: Timestamp? = null
)
