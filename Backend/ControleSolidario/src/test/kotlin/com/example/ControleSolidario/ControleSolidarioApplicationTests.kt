package com.example.ControleSolidario

import com.example.controle.ControleSolidarioApplication
import com.example.controle.controller.AcaoController
import com.example.controle.controller.DoacaoController
import com.example.controle.controller.UsersController
import com.example.controle.model.Acao
import com.example.controle.model.Doacao
import com.example.controle.model.Users
import com.google.api.core.ApiFuture
import com.google.cloud.Timestamp
import com.google.cloud.firestore.CollectionReference
import com.google.cloud.firestore.DocumentReference
import com.google.cloud.firestore.DocumentSnapshot
import com.google.cloud.firestore.Firestore
import com.google.cloud.firestore.Query
import com.google.cloud.firestore.QueryDocumentSnapshot
import com.google.cloud.firestore.QuerySnapshot
import com.google.cloud.firestore.WriteResult
import com.google.firebase.cloud.FirestoreClient
import io.mockk.*
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import java.util.concurrent.ExecutionException

@SpringBootTest(classes = [ControleSolidarioApplication::class])
class ControleSolidarioApplicationTests {

	// Teste de contexto de aplicação, para garantir que o Spring Boot pode carregar.
	@Test
	fun contextLoads() {
		// Este teste verifica apenas se o contexto do Spring Boot carrega sem erros.
		// Nenhuma lógica de aplicação específica é testada aqui.
	}

	// --- Testes para AcaoController ---
	@Nested
	inner class AcaoControllerTests {
		private lateinit var acaoController: AcaoController

		private val firestore: Firestore = mockk()
		private val collectionReference: CollectionReference = mockk()
		private val documentReference: DocumentReference = mockk()
		private val query: Query = mockk()
		private val apiFutureDocumentSnapshot: ApiFuture<DocumentSnapshot> = mockk()
		private val apiFutureQuerySnapshot: ApiFuture<QuerySnapshot> = mockk()
		private val querySnapshot: QuerySnapshot = mockk()
		private val writeResult: WriteResult = mockk()

		@BeforeEach
		fun setup() {
			// Mocks estáticos precisam ser ativados antes de qualquer uso
			mockkStatic(FirestoreClient::class)
			every { FirestoreClient.getFirestore() } returns firestore

			every { firestore.collection("acoes") } returns collectionReference

			acaoController = AcaoController() // Assumindo que AcaoController não tem injeção via Spring diretamente no construtor
		}

		@AfterEach
		fun teardown() {
			unmockkAll() // Desmoca tudo o que foi mockado estaticamente e outras mocks
		}

		@Test
		fun `AcaoController - inserirAcao deve retornar sucesso e ID quando a insercao e bem-sucedida`() {
			every { collectionReference.document() } returns documentReference
			every { documentReference.id } returns "acao123"
			every { documentReference.set(any<Acao>()) } returns mockk<ApiFuture<WriteResult>>().also {
				every { it.get() } returns writeResult
			}

			val acao = Acao(titulo = "Teste Acao", descricao = "Descricao de teste", status = "Planejada")

			val (sucesso, id) = acaoController.inserirAcao(acao)

			assertTrue(sucesso)
			assertEquals("acao123", id)
			verify { documentReference.set(acao.copy(id = "acao123")) }
		}

		@Test
		fun `AcaoController - inserirAcao deve retornar falha quando ocorre uma excecao`() {
			val errorMessage = "Simulated Firestore error"
			every { collectionReference.document() } throws RuntimeException(errorMessage)

			val acao = Acao(titulo = "Teste Acao", descricao = "Descricao de teste", status = "Planejada")

			val (sucesso, mensagemErro) = acaoController.inserirAcao(acao)

			assertFalse(sucesso)
			assertEquals(errorMessage, mensagemErro)
			verify(exactly = 0) { documentReference.set(any<Acao>()) }
		}

		@Test
		fun `AcaoController - listarTodasAcoes deve retornar uma lista de acoes quando houver dados`() {
			val docSnapshot1: QueryDocumentSnapshot = mockk(relaxed = true) {
				every { id } returns "id1"
				every { toObject(Acao::class.java) } returns Acao(id = "id1", titulo = "Acao 1")
			}
			val docSnapshot2: QueryDocumentSnapshot = mockk(relaxed = true) {
				every { id } returns "id2"
				every { toObject(Acao::class.java) } returns Acao(id = "id2", titulo = "Acao 2")
			}

			every { apiFutureQuerySnapshot.get() } returns querySnapshot
			every { querySnapshot.documents } returns listOf(docSnapshot1, docSnapshot2)
			every { collectionReference.get() } returns apiFutureQuerySnapshot

			val result = acaoController.listarTodasAcoes()

			assertEquals(2, result.size)
			assertEquals(Acao(id = "id1", titulo = "Acao 1"), result[0])
			assertEquals(Acao(id = "id2", titulo = "Acao 2"), result[1])
			verify { collectionReference.get() }
		}

		@Test
		fun `AcaoController - listarTodasAcoes deve retornar uma lista vazia quando nao houver dados`() {
			every { apiFutureQuerySnapshot.get() } returns querySnapshot
			every { querySnapshot.documents } returns emptyList()
			every { collectionReference.get() } returns apiFutureQuerySnapshot

			val result = acaoController.listarTodasAcoes()

			assertTrue(result.isEmpty())
			verify { collectionReference.get() }
		}

		@Test
		fun `AcaoController - listarTodasAcoes deve retornar uma lista vazia quando ocorre uma excecao`() {
			every { collectionReference.get() } throws RuntimeException("Simulated Firestore error")

			val result = acaoController.listarTodasAcoes()

			assertTrue(result.isEmpty())
			verify { collectionReference.get() }
		}

		@Test
		fun `AcaoController - atualizarAcao deve retornar true quando a atualizacao e bem-sucedida`() {
			val idAcao = "acao123"
			val acaoAtualizada = Acao(id = idAcao, titulo = "Acao Atualizada", descricao = "Nova descricao")

			every { collectionReference.document(idAcao) } returns documentReference
			every { documentReference.set(acaoAtualizada.copy(id = idAcao)) } returns mockk<ApiFuture<WriteResult>>().also {
				every { it.get() } returns writeResult
			}

			val result = acaoController.atualizarAcao(idAcao, acaoAtualizada)

			assertTrue(result)
			verify { documentReference.set(acaoAtualizada.copy(id = idAcao)) }
		}

		@Test
		fun `AcaoController - atualizarAcao deve retornar false quando ocorre uma excecao`() {
			val idAcao = "acao123"
			val acaoAtualizada = Acao(id = idAcao, titulo = "Acao Atualizada", descricao = "Nova descricao")

			every { collectionReference.document(idAcao) } returns documentReference
			every { documentReference.set(any<Acao>()) } throws RuntimeException("Erro na atualização")

			val result = acaoController.atualizarAcao(idAcao, acaoAtualizada)

			assertFalse(result)
			verify { documentReference.set(any<Acao>()) }
		}

		@Test
		fun `AcaoController - deletarAcao deve retornar true quando a delecao e bem-sucedida`() {
			val idAcao = "acao123"

			every { collectionReference.document(idAcao) } returns documentReference
			every { documentReference.delete() } returns mockk<ApiFuture<WriteResult>>().also {
				every { it.get() } returns writeResult
			}

			val result = acaoController.deletarAcao(idAcao)

			assertTrue(result)
			verify { documentReference.delete() }
		}

		@Test
		fun `AcaoController - deletarAcao deve retornar false quando ocorre uma excecao`() {
			val idAcao = "acao123"

			every { collectionReference.document(idAcao) } returns documentReference
			every { documentReference.delete() } throws RuntimeException("Erro na deleção")

			val result = acaoController.deletarAcao(idAcao)

			assertFalse(result)
			verify { documentReference.delete() }
		}
	}

	// --- Testes para DoacaoController ---
	@Nested
	inner class DoacaoControllerTests {
		private lateinit var doacaoController: DoacaoController

		private val firestore: Firestore = mockk()
		private val collectionReference: CollectionReference = mockk()
		private val documentReference: DocumentReference = mockk()
		private val query: Query = mockk()
		private val apiFutureQuerySnapshot: ApiFuture<QuerySnapshot> = mockk()
		private val querySnapshot: QuerySnapshot = mockk()
		private val writeResult: WriteResult = mockk()

		@BeforeEach
		fun setup() {
			mockkStatic(FirestoreClient::class)
			every { FirestoreClient.getFirestore() } returns firestore

			every { firestore.collection("doacao") } returns collectionReference

			doacaoController = DoacaoController()
		}

		@AfterEach
		fun teardown() {
			unmockkAll()
			unmockkStatic(Timestamp::class) // Desmoca Timestamp.class se foi mockado em um teste específico
		}

		@Test
		fun `DoacaoController - inserirDoacao deve retornar sucesso e ID quando a insercao e bem-sucedida`() {
			every { collectionReference.document() } returns documentReference
			every { documentReference.id } returns "doacao123"

			mockkStatic(Timestamp::class)
			val now = Timestamp.now()
			every { Timestamp.now() } returns now

			every { documentReference.set(any<Doacao>()) } returns mockk<ApiFuture<WriteResult>>().also {
				every { it.get() } returns writeResult
			}

			val doacao = Doacao(valor = 100.0, descricao = "Teste", tipo = "Dinheiro")
			val (sucesso, id) = doacaoController.inserirDoacao(doacao)

			assertTrue(sucesso)
			assertEquals("doacao123", id)
			verify { documentReference.set(doacao.copy(id = "doacao123", data = now)) }
		}

		@Test
		fun `DoacaoController - inserirDoacao deve retornar falha quando ocorre uma excecao`() {
			val errorMessage = "Simulated Firestore error"
			every { collectionReference.document() } throws RuntimeException(errorMessage)

			val doacao = Doacao(valor = 100.0)
			val (sucesso, mensagemErro) = doacaoController.inserirDoacao(doacao)

			assertFalse(sucesso)
			assertEquals(errorMessage, mensagemErro)
			verify(exactly = 0) { documentReference.set(any<Doacao>()) }
		}

		@Test
		fun `DoacaoController - listarDoacoesPorDoador deve retornar doacoes filtradas`() {
			val idDoador = "doador1"
			val docSnapshot1: QueryDocumentSnapshot = mockk(relaxed = true) {
				every { id } returns "d1"
				every { toObject(Doacao::class.java) } returns Doacao(id = "d1", idDoador = idDoador, valor = 50.0)
			}

			every { collectionReference.whereEqualTo("idDoador", idDoador) } returns query
			every { query.get() } returns apiFutureQuerySnapshot
			every { apiFutureQuerySnapshot.get() } returns querySnapshot
			every { querySnapshot.documents } returns listOf(docSnapshot1)

			val result = doacaoController.listarDoacoesPorDoador(idDoador)

			assertEquals(1, result.size)
			assertEquals(Doacao(id = "d1", idDoador = idDoador, valor = 50.0), result[0])
			verify { collectionReference.whereEqualTo("idDoador", idDoador) }
		}

		@Test
		fun `DoacaoController - listarDoacoesPorDoador deve retornar lista vazia se nao houver doacoes para o doador`() {
			val idDoador = "doadorSemDoacao"
			every { collectionReference.whereEqualTo("idDoador", idDoador) } returns query
			every { query.get() } returns apiFutureQuerySnapshot
			every { apiFutureQuerySnapshot.get() } returns querySnapshot
			every { querySnapshot.documents } returns emptyList()

			val result = doacaoController.listarDoacoesPorDoador(idDoador)

			assertTrue(result.isEmpty())
			verify { collectionReference.whereEqualTo("idDoador", idDoador) }
		}

		@Test
		fun `DoacaoController - listarDoacoesPorDoador deve retornar lista vazia em caso de excecao`() {
			every { collectionReference.whereEqualTo(any<String>(), any()) } throws RuntimeException("Erro de filtro")

			val result = doacaoController.listarDoacoesPorDoador("someId")

			assertTrue(result.isEmpty())
		}

		@Test
		fun `DoacaoController - listarDoacoesPorOng deve retornar doacoes filtradas`() {
			val idOng = "ong1"
			val docSnapshot1: QueryDocumentSnapshot = mockk(relaxed = true) {
				every { id } returns "d1"
				every { toObject(Doacao::class.java) } returns Doacao(id = "d1", idOng = idOng, valor = 100.0)
			}

			every { collectionReference.whereEqualTo("idOng", idOng) } returns query
			every { query.get() } returns apiFutureQuerySnapshot
			every { apiFutureQuerySnapshot.get() } returns querySnapshot
			every { querySnapshot.documents } returns listOf(docSnapshot1)

			val result = doacaoController.listarDoacoesPorOng(idOng)

			assertEquals(1, result.size)
			assertEquals(Doacao(id = "d1", idOng = idOng, valor = 100.0), result[0])
			verify { collectionReference.whereEqualTo("idOng", idOng) }
		}

		@Test
		fun `DoacaoController - listarDoacoesPorOng deve retornar lista vazia se nao houver doacoes para a ong`() {
			val idOng = "ongSemDoacao"
			every { collectionReference.whereEqualTo("idOng", idOng) } returns query
			every { query.get() } returns apiFutureQuerySnapshot
			every { apiFutureQuerySnapshot.get() } returns querySnapshot
			every { querySnapshot.documents } returns emptyList()

			val result = doacaoController.listarDoacoesPorOng(idOng)

			assertTrue(result.isEmpty())
			verify { collectionReference.whereEqualTo("idOng", idOng) }
		}

		@Test
		fun `DoacaoController - listarDoacoesPorOng deve retornar lista vazia em caso de excecao`() {
			every { collectionReference.whereEqualTo(any<String>(), any()) } throws RuntimeException("Erro de filtro")

			val result = doacaoController.listarDoacoesPorOng("someId")

			assertTrue(result.isEmpty())
		}

		@Test
		fun `DoacaoController - listarTodasDoacoes deve retornar uma lista de doacoes quando houver dados`() {
			val docSnapshot1: QueryDocumentSnapshot = mockk(relaxed = true) {
				every { id } returns "doacao1"
				every { toObject(Doacao::class.java) } returns Doacao(id = "doacao1", valor = 10.0)
			}

			every { apiFutureQuerySnapshot.get() } returns querySnapshot
			every { querySnapshot.documents } returns listOf(docSnapshot1)
			every { collectionReference.get() } returns apiFutureQuerySnapshot

			val result = doacaoController.listarTodasDoacoes()

			assertEquals(1, result.size)
			assertEquals(Doacao(id = "doacao1", valor = 10.0), result[0])
			verify { collectionReference.get() }
		}

		@Test
		fun `DoacaoController - listarTodasDoacoes deve retornar uma lista vazia quando nao houver dados`() {
			every { apiFutureQuerySnapshot.get() } returns querySnapshot
			every { querySnapshot.documents } returns emptyList()
			every { collectionReference.get() } returns apiFutureQuerySnapshot

			val result = doacaoController.listarTodasDoacoes()

			assertTrue(result.isEmpty())
			verify { collectionReference.get() }
		}

		@Test
		fun `DoacaoController - listarTodasDoacoes deve retornar uma lista vazia quando ocorre uma excecao`() {
			every { collectionReference.get() } throws RuntimeException("Simulated error")

			val result = doacaoController.listarTodasDoacoes()

			assertTrue(result.isEmpty())
		}

		@Test
		fun `DoacaoController - deletarDoacao deve retornar true quando a delecao e bem-sucedida`() {
			val idDoacao = "doacao123"

			every { collectionReference.document(idDoacao) } returns documentReference
			every { documentReference.delete() } returns mockk<ApiFuture<WriteResult>>().also {
				every { it.get() } returns writeResult
			}

			val result = doacaoController.deletarDoacao(idDoacao)

			assertTrue(result)
			verify { documentReference.delete() }
		}

		@Test
		fun `DoacaoController - deletarDoacao deve retornar false quando ocorre uma excecao`() {
			val idDoacao = "doacao123"

			every { collectionReference.document(idDoacao) } returns documentReference
			every { documentReference.delete() } throws RuntimeException("Erro na deleção")

			val result = doacaoController.deletarDoacao(idDoacao)

			assertFalse(result)
			verify { documentReference.delete() }
		}
	}

	// --- Testes para UsersController ---
	@Nested
	inner class UsersControllerTests {
		private lateinit var usersController: UsersController

		private val firestore: Firestore = mockk()
		private val collectionReference: CollectionReference = mockk()
		private val documentReference: DocumentReference = mockk()
		private val query: Query = mockk()
		private val apiFutureDocumentSnapshot: ApiFuture<DocumentSnapshot> = mockk()
		private val apiFutureQuerySnapshot: ApiFuture<QuerySnapshot> = mockk()
		private val querySnapshot: QuerySnapshot = mockk()
		private val writeResult: WriteResult = mockk()

		@BeforeEach
		fun setup() {
			mockkStatic(FirestoreClient::class)
			every { FirestoreClient.getFirestore() } returns firestore

			every { firestore.collection("usuarios") } returns collectionReference

			usersController = UsersController()
		}

		@AfterEach
		fun teardown() {
			unmockkAll()
		}

		@Test
		fun `UsersController - inserirUsuario deve retornar sucesso e email quando a insercao e bem-sucedida`() {
			val testUser = Users(email = "test@example.com", nome = "Test User")

			every { collectionReference.document(testUser.email!!) } returns documentReference
			every { documentReference.set(any<Users>()) } returns mockk<ApiFuture<WriteResult>>().also {
				every { it.get() } returns writeResult
			}

			val (sucesso, resultado) = usersController.inserirUsuario(testUser)

			assertTrue(sucesso)
			assertEquals(testUser.email, resultado)
			verify { documentReference.set(testUser) }
		}

		@Test
		fun `UsersController - inserirUsuario deve retornar falha quando ocorre uma excecao`() {
			val testUser = Users(email = "fail@example.com", nome = "Fail User")
			val errorMessage = "Simulated Firestore error"

			every { collectionReference.document(testUser.email!!) } throws RuntimeException(errorMessage)

			val (sucesso, resultado) = usersController.inserirUsuario(testUser)

			assertFalse(sucesso)
			assertEquals(errorMessage, resultado)
			verify(exactly = 0) { documentReference.set(any<Users>()) }
		}

		@Test
		fun `UsersController - listarTodosUsuarios deve retornar uma lista de usuarios quando houver dados`() {
			val docSnapshot1: QueryDocumentSnapshot = mockk(relaxed = true) {
				every { id } returns "user1@example.com"
				every { toObject(Users::class.java) } returns Users(email = "user1@example.com", nome = "User One")
			}
			val docSnapshot2: QueryDocumentSnapshot = mockk(relaxed = true) {
				every { id } returns "user2@example.com"
				every { toObject(Users::class.java) } returns Users(email = "user2@example.com", nome = "User Two")
			}

			every { apiFutureQuerySnapshot.get() } returns querySnapshot
			every { querySnapshot.documents } returns listOf(docSnapshot1, docSnapshot2)
			every { collectionReference.get() } returns apiFutureQuerySnapshot

			val result = usersController.listarTodosUsuarios()

			assertEquals(2, result.size)
			assertEquals(Users(email = "user1@example.com", nome = "User One"), result[0])
			assertEquals(Users(email = "user2@example.com", nome = "User Two"), result[1])
			verify { collectionReference.get() }
		}

		@Test
		fun `UsersController - listarTodosUsuarios deve retornar uma lista vazia quando nao houver dados`() {
			every { apiFutureQuerySnapshot.get() } returns querySnapshot
			every { querySnapshot.documents } returns emptyList()
			every { collectionReference.get() } returns apiFutureQuerySnapshot

			val result = usersController.listarTodosUsuarios()

			assertTrue(result.isEmpty())
			verify { collectionReference.get() }
		}

		@Test
		fun `UsersController - listarTodosUsuarios deve retornar uma lista vazia quando ocorre uma excecao`() {
			every { collectionReference.get() } throws RuntimeException("Simulated error")

			val result = usersController.listarTodosUsuarios()

			assertTrue(result.isEmpty())
		}

		@Test
		fun `UsersController - buscarUsuarioPorEmail deve retornar usuario quando encontrado`() {
			val testEmail = "found@example.com"
			val foundUser = Users(email = testEmail, nome = "Found User")

			val docSnapshot: DocumentSnapshot = mockk(relaxed = true) {
				every { exists() } returns true
				every { toObject(Users::class.java) } returns foundUser
			}

			every { collectionReference.document(testEmail) } returns documentReference
			every { documentReference.get() } returns mockk<ApiFuture<DocumentSnapshot>>().also {
				every { it.get() } returns docSnapshot
			}

			val result = usersController.buscarUsuarioPorEmail(testEmail)

			assertEquals(foundUser, result)
			verify { documentReference.get() }
		}

		@Test
		fun `UsersController - buscarUsuarioPorEmail deve retornar null quando nao encontrado`() {
			val testEmail = "notfound@example.com"

			val docSnapshot: DocumentSnapshot = mockk(relaxed = true) {
				every { exists() } returns false
			}

			every { collectionReference.document(testEmail) } returns documentReference
			every { documentReference.get() } returns mockk<ApiFuture<DocumentSnapshot>>().also {
				every { it.get() } returns docSnapshot
			}

			val result = usersController.buscarUsuarioPorEmail(testEmail)

			assertNull(result)
			verify { documentReference.get() }
		}

		@Test
		fun `UsersController - buscarUsuarioPorEmail deve retornar null quando ocorre excecao`() {
			val testEmail = "error@example.com"

			every { collectionReference.document(testEmail) } returns documentReference
			every { documentReference.get() } throws RuntimeException("Simulated Firestore error")

			val result = usersController.buscarUsuarioPorEmail(testEmail)

			assertNull(result)
		}

		@Test
		fun `UsersController - buscarUsuarioPorNome deve retornar usuario quando encontrado`() {
			val testName = "Nome Teste"
			val foundUser = Users(email = "nome@example.com", nome = testName)

			val docSnapshot: QueryDocumentSnapshot = mockk(relaxed = true) {
				every { toObject(Users::class.java) } returns foundUser
			}

			every { collectionReference.whereEqualTo("nome", testName) } returns query
			every { query.get() } returns apiFutureQuerySnapshot
			every { apiFutureQuerySnapshot.get() } returns querySnapshot
			every { querySnapshot.documents } returns listOf(docSnapshot)

			val result = usersController.buscarUsuarioPorNome(testName)

			assertEquals(foundUser, result)
			verify { collectionReference.whereEqualTo("nome", testName) }
		}

		@Test
		fun `UsersController - buscarUsuarioPorNome deve retornar null quando nao encontrado`() {
			val testName = "Nome Nao Existe"

			every { collectionReference.whereEqualTo("nome", testName) } returns query
			every { query.get() } returns apiFutureQuerySnapshot
			every { apiFutureQuerySnapshot.get() } returns querySnapshot
			every { querySnapshot.documents } returns emptyList()

			val result = usersController.buscarUsuarioPorNome(testName)

			assertNull(result)
			verify { collectionReference.whereEqualTo("nome", testName) }
		}

		@Test
		fun `UsersController - buscarUsuarioPorNome deve retornar null quando ocorre excecao`() {
			val testName = "Nome Com Erro"

			every { collectionReference.whereEqualTo("nome", testName) } throws RuntimeException("Erro de busca")

			val result = usersController.buscarUsuarioPorNome(testName)

			assertNull(result)
		}

		@Test
		fun `UsersController - atualizarUsuario deve retornar true quando a atualizacao e bem-sucedida`() {
			val testEmail = "update@example.com"
			val updatedUser = Users(email = testEmail, nome = "Updated User")

			every { collectionReference.document(testEmail) } returns documentReference
			every { documentReference.set(updatedUser) } returns mockk<ApiFuture<WriteResult>>().also {
				every { it.get() } returns writeResult
			}

			val result = usersController.atualizarUsuario(testEmail, updatedUser)

			assertTrue(result)
			verify { documentReference.set(updatedUser) }
		}

		@Test
		fun `UsersController - atualizarUsuario deve retornar false quando ocorre uma excecao`() {
			val testEmail = "update_fail@example.com"
			val updatedUser = Users(email = testEmail, nome = "Updated Fail User")

			every { collectionReference.document(testEmail) } returns documentReference
			every { documentReference.set(any<Users>()) } throws RuntimeException("Erro na atualização")

			val result = usersController.atualizarUsuario(testEmail, updatedUser)

			assertFalse(result)
			verify { documentReference.set(any<Users>()) }
		}

		@Test
		fun `UsersController - deletarUsuario deve retornar true quando a delecao e bem-sucedida`() {
			val testEmail = "delete@example.com"

			every { collectionReference.document(testEmail) } returns documentReference
			every { documentReference.delete() } returns mockk<ApiFuture<WriteResult>>().also {
				every { it.get() } returns writeResult
			}

			val result = usersController.deletarUsuario(testEmail)

			assertTrue(result)
			verify { documentReference.delete() }
		}

		@Test
		fun `UsersController - deletarUsuario deve retornar false quando ocorre uma excecao`() {
			val testEmail = "delete_fail@example.com"

			every { collectionReference.document(testEmail) } returns documentReference
			every { documentReference.delete() } throws RuntimeException("Erro na deleção")

			val result = usersController.deletarUsuario(testEmail)

			assertFalse(result)
			verify { documentReference.delete() }
		}
	}
}
