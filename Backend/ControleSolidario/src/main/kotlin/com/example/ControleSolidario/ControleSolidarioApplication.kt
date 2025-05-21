package com.example.controle

import com.example.controle.controller.DoacaoController
import com.example.controle.controller.AcaoController
import com.example.controle.controller.UsuarioController
import com.example.controle.model.Doacao
import com.example.controle.model.Acao
import com.example.controle.model.Usuario
import com.example.controle.service.FirebaseService
import java.text.SimpleDateFormat
import java.util.*

fun main() {
	val scanner = Scanner(System.`in`)
	val firebaseService = FirebaseService()
	val doacaoController = DoacaoController(firebaseService)
	val acaoController = AcaoController(firebaseService)
	val UsuarioController = UsuarioController(firebaseService)

	while (true) {
		println("\n=== MENU PRINCIPAL ===")
		println("1. CRUD Doações")
		println("2. CRUD Ações")
		println("3. CRUD Usuários")
		println("0. Sair")
		print("Escolha uma opção: ")

		when (scanner.nextLine()) {
			"1" -> menuDoacoes(scanner, doacaoController)
			"2" -> menuAcoes(scanner, acaoController)
			"3" -> menuUsuarios(scanner, UsuarioController)
			"0" -> {
				println("Encerrando...")
				break
			}
			else -> println("❌ Opção inválida.")
		}
	}
}

fun menuDoacoes(scanner: Scanner, controller: DoacaoController) {
	while (true) {
		println("\n=== MENU DOAÇÃO ===")
		println("1. Inserir nova doação")
		println("2. Listar todas as doações")
		println("3. Atualizar doação")
		println("4. Deletar doação")
		println("0. Voltar")
		print("Escolha uma opção: ")

		when (scanner.nextLine()) {
			"1" -> controller.inserirDoacao(criarDoacao(scanner))
			"2" -> {
				val doacoes = controller.listarTodasDoacoes()
				if (doacoes.isEmpty()) println("Nenhuma doação encontrada.")
				else doacoes.forEach { (id, d) -> println("ID: $id | $d") }
			}
			"3" -> {
				print("ID da doação a atualizar: ")
				val id = scanner.nextLine()
				controller.atualizarDoacao(id, criarDoacao(scanner))
			}
			"4" -> {
				print("ID da doação a deletar: ")
				val id = scanner.nextLine()
				controller.deletarDoacao(id)
			}
			"0" -> return
			else -> println("❌ Opção inválida.")
		}
	}
}

fun criarDoacao(scanner: Scanner): Doacao {
	print("ID do Doador: ")
	val idDoador = scanner.nextLine()
	print("ID da ONG: ")
	val idOng = scanner.nextLine()
	print("Valor: ")
	val valor = scanner.nextLine().toDoubleOrNull() ?: 0.0
	print("Descrição: ")
	val descricao = scanner.nextLine()
	print("Tipo: ")
	val tipo = scanner.nextLine()

	return Doacao(
		data = Date(),
		idDoador = idDoador,
		idOng = idOng,
		valor = valor,
		descricao = descricao,
		tipo = tipo
	)
}

fun menuAcoes(scanner: Scanner, controller: AcaoController) {
	while (true) {
		println("\n=== MENU AÇÕES ===")
		println("1. Inserir nova ação")
		println("2. Listar todas as ações")
		println("3. Atualizar ação")
		println("4. Deletar ação")
		println("0. Voltar")
		print("Escolha uma opção: ")

		when (scanner.nextLine()) {
			"1" -> controller.inserirAcao(criarAcao(scanner))
			"2" -> {
				val acoes = controller.listarTodasAcoes()
				if (acoes.isEmpty()) println("Nenhuma ação encontrada.")
				else acoes.forEach { (id, a) -> println("ID: $id | $a") }
			}
			"3" -> {
				print("ID da ação a atualizar: ")
				val id = scanner.nextLine()
				controller.atualizarAcao(id, criarAcao(scanner))
			}
			"4" -> {
				print("ID da ação a deletar: ")
				val id = scanner.nextLine()
				controller.deletarAcao(id)
			}
			"0" -> return
			else -> println("❌ Opção inválida.")
		}
	}
}

fun criarAcao(scanner: Scanner): Acao {
	val formato = SimpleDateFormat("yyyy-MM-dd")

	print("Título: ")
	val titulo = scanner.nextLine()
	print("Descrição: ")
	val descricao = scanner.nextLine()
	print("ID da ONG: ")
	val idOng = scanner.nextLine()
	print("Status: ")
	val status = scanner.nextLine()
	print("Data de Início (yyyy-MM-dd): ")
	val dataInicio = formato.parse(scanner.nextLine())
	print("Data de Fim (yyyy-MM-dd): ")
	val dataFim = formato.parse(scanner.nextLine())

	return Acao(
		titulo = titulo,
		descricao = descricao,
		idOng = idOng,
		status = status,
		dataInicio = dataInicio,
		dataFim = dataFim
	)
}

fun menuUsuarios(scanner: Scanner, controller: UsuarioController) {
	while (true) {
		println("\n=== MENU USUÁRIOS ===")
		println("1. Inserir novo usuário")
		println("2. Listar todos os usuários")
		println("3. Atualizar usuário")
		println("4. Deletar usuário")
		println("0. Voltar")
		print("Escolha uma opção: ")

		when (scanner.nextLine()) {
			"1" -> controller.inserirUsuario(criarUsuario(scanner))
			"2" -> {
				val usuarios = controller.listarTodosUsuarios()
				if (usuarios.isEmpty()) println("Nenhum usuário encontrado.")
				else usuarios.forEach { (id, u) -> println("ID: $id | $u") }
			}
			"3" -> {
				print("ID do usuário a atualizar: ")
				val id = scanner.nextLine()
				controller.atualizarUsuario(id, criarUsuario(scanner))
			}
			"4" -> {
				print("ID do usuário a deletar: ")
				val id = scanner.nextLine()
				controller.deletarUsuario(id)
			}
			"0" -> return
			else -> println("❌ Opção inválida.")
		}
	}
}

fun criarUsuario(scanner: Scanner): Usuario {
	print("Nome: ")
	val nome = scanner.nextLine()
	print("Nome Completo: ")
	val nomeCompleto = scanner.nextLine()
	print("Nome de Usuário: ")
	val nomeUsuario = scanner.nextLine()
	print("Email: ")
	val email = scanner.nextLine()
	print("Telefone: ")
	val telefone = scanner.nextLine()
	print("CEP: ")
	val cep = scanner.nextLine()
	print("Endereço: ")
	val endereco = scanner.nextLine()
	print("Descrição: ")
	val descricao = scanner.nextLine()
	print("Classificação: ")
	val classificacao = scanner.nextLine()
	print("Representante: ")
	val representante = scanner.nextLine()
	print("CNPJ: ")
	val cnpj = scanner.nextLine()
	print("CPF: ")
	val cpf = scanner.nextLine()
	print("Foto de Perfil (URL): ")
	val fotoPerfil = scanner.nextLine()
	print("UID: ")
	val uid = scanner.nextLine()

	return Usuario(
		nome = nome,
		nomeCompleto = nomeCompleto,
		nomeUsuario = nomeUsuario,
		email = email,
		telefone = telefone,
		cep = cep,
		endereco = endereco,
		descricao = descricao,
		classificacao = classificacao,
		representante = representante,
		cnpj = cnpj,
		cpf = cpf,
		fotoPerfil = fotoPerfil,
		uid = uid,
		criadoEm = Date()
	)
}
