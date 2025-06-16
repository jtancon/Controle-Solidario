package controller // Pacote CORRIGIDO para corresponder ao caminho src/test/kotlin/controller

import com.example.controle.controller.AcaoController // Importação correta da classe AcaoController do pacote da aplicação principal
import com.example.controle.model.Acao
import com.example.controle.service.FirebaseService
import com.google.cloud.Timestamp
import com.google.cloud.firestore.CollectionReference
import com.google.cloud.firestore.DocumentReference
import com.google.cloud.firestore.DocumentSnapshot
import com.google.cloud.firestore.Firestore
import com.google.cloud.firestore.Query
import com.google.cloud.firestore.QuerySnapshot
import com.google.cloud.firestore.WriteResult
import com.google.cloud.firestore.QueryDocumentSnapshot // Importe QueryDocumentSnapshot
import com.google.firebase.cloud.FirestoreClient
import com.google.api.core.ApiFuture
import io.mockk.*
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.Assertions.*
import java.util.concurrent.ExecutionException

// O nome da classe de teste pode permanecer o mesmo, apenas o pacote mudou.
class AcaoControllerTest {

    // Instância do controlador que será testado
    private lateinit var acaoController: AcaoController

    // Mocks para simular o comportamento do Firestore
    private val firestore: Firestore = mockk()
    private val collectionReference: CollectionReference = mockk()
    private val documentReference: DocumentReference = mockk()
    private val query: Query = mockk()
    private val apiFutureDocumentSnapshot: ApiFuture<DocumentSnapshot> = mockk()
    private val apiFutureQuerySnapshot: ApiFuture<QuerySnapshot> = mockk()
    private val querySnapshot: QuerySnapshot = mockk()
    private val writeResult: WriteResult = mockk()

    // Este bloco é executado antes de cada teste
    @BeforeEach
    fun setup() {
        mockkStatic(FirestoreClient::class)
        every { FirestoreClient.getFirestore() } returns firestore

        every { firestore.collection("acoes") } returns collectionReference

        acaoController = AcaoController()
    }

    // Este bloco é executado após cada teste para limpar os mocks
    @AfterEach
    fun teardown() {
        unmockkAll()
    }

    @Test
    fun `inserirAcao deve retornar sucesso e ID quando a insercao e bem-sucedida`() {
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
    fun `inserirAcao deve retornar falha quando ocorre uma excecao`() {
        val errorMessage = "Simulated Firestore error"
        every { collectionReference.document() } throws RuntimeException(errorMessage)

        val acao = Acao(titulo = "Teste Acao", descricao = "Descricao de teste", status = "Planejada")

        val (sucesso, mensagemErro) = acaoController.inserirAcao(acao)

        assertFalse(sucesso)
        assertEquals(errorMessage, mensagemErro)
        verify(exactly = 0) { documentReference.set(any<Acao>()) }
    }

    @Test
    fun `listarTodasAcoes deve retornar uma lista de acoes quando houver dados`() {
        // Cria mocks de QueryDocumentSnapshot para simular documentos do Firestore
        val docSnapshot1: QueryDocumentSnapshot = mockk(relaxed = true) { // relaxed para toObject funcionar sem mock extra
            every { id } returns "id1"
            every { toObject(Acao::class.java) } returns Acao(id = "id1", titulo = "Acao 1")
        }

        val docSnapshot2: QueryDocumentSnapshot = mockk(relaxed = true) {
            every { id } returns "id2"
            every { toObject(Acao::class.java) } returns Acao(id = "id2", titulo = "Acao 2")
        }

        every { apiFutureQuerySnapshot.get() } returns querySnapshot
        // Retorna uma lista de QueryDocumentSnapshot
        every { querySnapshot.documents } returns listOf(docSnapshot1, docSnapshot2)
        every { collectionReference.get() } returns apiFutureQuerySnapshot

        val result = acaoController.listarTodasAcoes()

        assertEquals(2, result.size)
        // Note que o copy(id=it.id) está no seu controlador, então esperamos o objeto com o ID já setado
        assertEquals(Acao(id = "id1", titulo = "Acao 1"), result[0])
        assertEquals(Acao(id = "id2", titulo = "Acao 2"), result[1])
        verify { collectionReference.get() }
    }

    @Test
    fun `listarTodasAcoes deve retornar uma lista vazia quando nao houver dados`() {
        every { apiFutureQuerySnapshot.get() } returns querySnapshot
        every { querySnapshot.documents } returns emptyList()
        every { collectionReference.get() } returns apiFutureQuerySnapshot

        val result = acaoController.listarTodasAcoes()

        assertTrue(result.isEmpty())
        verify { collectionReference.get() }
    }

    @Test
    fun `listarTodasAcoes deve retornar uma lista vazia quando ocorre uma excecao`() {
        every { collectionReference.get() } throws RuntimeException("Simulated Firestore error")

        val result = acaoController.listarTodasAcoes()

        assertTrue(result.isEmpty())
        verify { collectionReference.get() } // Adicionado verify para consistência
    }

    @Test
    fun `atualizarAcao deve retornar true quando a atualizacao e bem-sucedida`() {
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
    fun `atualizarAcao deve retornar false quando ocorre uma excecao`() {
        val idAcao = "acao123"
        val acaoAtualizada = Acao(id = idAcao, titulo = "Acao Atualizada", descricao = "Nova descricao")

        every { collectionReference.document(idAcao) } returns documentReference
        every { documentReference.set(any<Acao>()) } throws RuntimeException("Erro na atualização")

        val result = acaoController.atualizarAcao(idAcao, acaoAtualizada)

        assertFalse(result)
        verify { documentReference.set(any<Acao>()) } // Adicionado verify para consistência
    }

    @Test
    fun `deletarAcao deve retornar true quando a delecao e bem-sucedida`() {
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
    fun `deletarAcao deve retornar false quando ocorre uma excecao`() {
        val idAcao = "acao123"

        every { collectionReference.document(idAcao) } returns documentReference
        every { documentReference.delete() } throws RuntimeException("Erro na deleção")

        val result = acaoController.deletarAcao(idAcao)

        assertFalse(result)
        verify { documentReference.delete() }
    }
}
