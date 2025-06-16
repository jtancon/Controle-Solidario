package controller // Pacote CORRIGIDO para corresponder ao caminho src/test/kotlin/controller

import com.example.controle.model.Doacao
import com.example.controle.controller.DoacaoController // ADICIONADO: Importação explícita da classe DoacaoController da aplicação principal
import com.example.controle.service.FirebaseService // Importe FirebaseService se ainda estiver em 'controle'
import com.google.cloud.Timestamp
import com.google.cloud.firestore.*
import com.google.api.core.ApiFuture
import com.google.cloud.firestore.QueryDocumentSnapshot
import com.google.firebase.cloud.FirestoreClient
import io.mockk.*
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.Assertions.*
import java.util.concurrent.ExecutionException

class DoacaoControllerTest {

    private lateinit var doacaoController: DoacaoController

    // Mocks
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

        // Garante que DoacaoController está no mesmo pacote da aplicação para que seja testado
        // A importação acima já resolve a referência.
        doacaoController = DoacaoController()
    }

    @AfterEach
    fun teardown() {
        unmockkAll()
        // Desmoca Timestamp.class após cada teste, se foi mockado em um teste específico
        unmockkStatic(Timestamp::class) // Correção: usar unmockkStatic para desmockar
    }

    @Test
    fun `inserirDoacao deve retornar sucesso e ID quando a insercao e bem-sucedida`() {
        every { collectionReference.document() } returns documentReference
        every { documentReference.id } returns "doacao123"

        // Mocka Timestamp.now() para que o teste seja determinístico
        mockkStatic(Timestamp::class)
        val now = Timestamp.now()
        every { Timestamp.now() } returns now

        // Alterado para ApiFuture<WriteResult>
        every { documentReference.set(any<Doacao>()) } returns mockk<ApiFuture<WriteResult>>().also {
            every { it.get() } returns writeResult
        }

        val doacao = Doacao(valor = 100.0, descricao = "Teste", tipo = "Dinheiro")
        val (sucesso, id) = doacaoController.inserirDoacao(doacao)

        assertTrue(sucesso)
        assertEquals("doacao123", id)
        // Verifica se o set foi chamado com o ID e o timestamp gerados
        verify { documentReference.set(doacao.copy(id = "doacao123", data = now)) }
    }

    @Test
    fun `inserirDoacao deve retornar falha quando ocorre uma excecao`() {
        val errorMessage = "Simulated Firestore error"
        every { collectionReference.document() } throws RuntimeException(errorMessage)

        val doacao = Doacao(valor = 100.0)
        val (sucesso, mensagemErro) = doacaoController.inserirDoacao(doacao)

        assertFalse(sucesso)
        assertEquals(errorMessage, mensagemErro)
        verify(exactly = 0) { documentReference.set(any<Doacao>()) }
    }

    @Test
    fun `listarDoacoesPorDoador deve retornar doacoes filtradas`() {
        val idDoador = "doador1"
        // Mock de QueryDocumentSnapshot para simular o que vem do Firestore
        val docSnapshot1: QueryDocumentSnapshot = mockk(relaxed = true) {
            every { id } returns "d1"
            every { toObject(Doacao::class.java) } returns Doacao(id = "d1", idDoador = idDoador, valor = 50.0)
        }

        every { collectionReference.whereEqualTo("idDoador", idDoador) } returns query
        every { query.get() } returns apiFutureQuerySnapshot
        every { apiFutureQuerySnapshot.get() } returns querySnapshot
        every { querySnapshot.documents } returns listOf(docSnapshot1) // Lista de QueryDocumentSnapshot

        val result = doacaoController.listarDoacoesPorDoador(idDoador)

        assertEquals(1, result.size)
        assertEquals(Doacao(id = "d1", idDoador = idDoador, valor = 50.0), result[0])
        verify { collectionReference.whereEqualTo("idDoador", idDoador) }
    }

    @Test
    fun `listarDoacoesPorDoador deve retornar lista vazia se nao houver doacoes para o doador`() {
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
    fun `listarDoacoesPorDoador deve retornar lista vazia em caso de excecao`() {
        every { collectionReference.whereEqualTo(any<String>(), any()) } throws RuntimeException("Erro de filtro")

        val result = doacaoController.listarDoacoesPorDoador("someId")

        assertTrue(result.isEmpty())
    }

    @Test
    fun `listarDoacoesPorOng deve retornar doacoes filtradas`() {
        val idOng = "ong1"
        // Mock de QueryDocumentSnapshot
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
    fun `listarDoacoesPorOng deve retornar lista vazia se nao houver doacoes para a ong`() {
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
    fun `listarDoacoesPorOng deve retornar lista vazia em caso de excecao`() {
        every { collectionReference.whereEqualTo(any<String>(), any()) } throws RuntimeException("Erro de filtro")

        val result = doacaoController.listarDoacoesPorOng("someId")

        assertTrue(result.isEmpty())
    }

    @Test
    fun `listarTodasDoacoes deve retornar uma lista de doacoes quando houver dados`() {
        // Mock de QueryDocumentSnapshot
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
    fun `listarTodasDoacoes deve retornar uma lista vazia quando nao houver dados`() {
        every { apiFutureQuerySnapshot.get() } returns querySnapshot
        every { querySnapshot.documents } returns emptyList()
        every { collectionReference.get() } returns apiFutureQuerySnapshot

        val result = doacaoController.listarTodasDoacoes()

        assertTrue(result.isEmpty())
        verify { collectionReference.get() }
    }

    @Test
    fun `listarTodasDoacoes deve retornar uma lista vazia quando ocorre uma excecao`() {
        every { collectionReference.get() } throws RuntimeException("Simulated error")

        val result = doacaoController.listarTodasDoacoes()

        assertTrue(result.isEmpty())
    }

    @Test
    fun `deletarDoacao deve retornar true quando a delecao e bem-sucedida`() {
        val idDoacao = "doacao123"

        every { collectionReference.document(idDoacao) } returns documentReference
        // Alterado para ApiFuture<WriteResult>
        every { documentReference.delete() } returns mockk<ApiFuture<WriteResult>>().also {
            every { it.get() } returns writeResult
        }

        val result = doacaoController.deletarDoacao(idDoacao)

        assertTrue(result)
        verify { documentReference.delete() }
    }

    @Test
    fun `deletarDoacao deve retornar false quando ocorre uma excecao`() {
        val idDoacao = "doacao123"

        every { collectionReference.document(idDoacao) } returns documentReference
        every { documentReference.delete() } throws RuntimeException("Erro na deleção")

        val result = doacaoController.deletarDoacao(idDoacao)

        assertFalse(result)
        verify { documentReference.delete() }
    }
}
