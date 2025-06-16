package controller // Pacote CORRIGIDO para corresponder ao caminho src/test/kotlin/controller

import com.example.controle.controller.UsersController // Importação correta da classe UsersController da aplicação principal
import com.example.controle.model.Users // Importação da classe Users
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

class UsersControllerTest { // Nome da classe de teste para UsersController

    private lateinit var usersController: UsersController

    // Mocks
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

        every { firestore.collection("usuarios") } returns collectionReference // Assumindo coleção "usuarios" para Users

        usersController = UsersController()
    }

    @AfterEach
    fun teardown() {
        unmockkAll()
    }

    @Test
    fun `inserirUsuario deve retornar sucesso e email quando a insercao e bem-sucedida`() {
        val testUser = Users(email = "test@example.com", nome = "Test User")

        every { collectionReference.document(testUser.email!!) } returns documentReference // Usa o email como ID
        every { documentReference.set(any<Users>()) } returns mockk<ApiFuture<WriteResult>>().also {
            every { it.get() } returns writeResult
        }

        val (sucesso, resultado) = usersController.inserirUsuario(testUser)

        assertTrue(sucesso)
        assertEquals(testUser.email, resultado)
        verify { documentReference.set(testUser) }
    }

    @Test
    fun `inserirUsuario deve retornar falha quando ocorre uma excecao`() {
        val testUser = Users(email = "fail@example.com", nome = "Fail User")
        val errorMessage = "Simulated Firestore error"

        every { collectionReference.document(testUser.email!!) } throws RuntimeException(errorMessage)

        val (sucesso, resultado) = usersController.inserirUsuario(testUser)

        assertFalse(sucesso)
        assertEquals(errorMessage, resultado)
        verify(exactly = 0) { documentReference.set(any<Users>()) }
    }

    @Test
    fun `listarTodosUsuarios deve retornar uma lista de usuarios quando houver dados`() {
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
    fun `listarTodosUsuarios deve retornar uma lista vazia quando nao houver dados`() {
        every { apiFutureQuerySnapshot.get() } returns querySnapshot
        every { querySnapshot.documents } returns emptyList()
        every { collectionReference.get() } returns apiFutureQuerySnapshot

        val result = usersController.listarTodosUsuarios()

        assertTrue(result.isEmpty())
        verify { collectionReference.get() }
    }

    @Test
    fun `listarTodosUsuarios deve retornar uma lista vazia quando ocorre uma excecao`() {
        every { collectionReference.get() } throws RuntimeException("Simulated error")

        val result = usersController.listarTodosUsuarios()

        assertTrue(result.isEmpty())
    }

    @Test
    fun `buscarUsuarioPorEmail deve retornar usuario quando encontrado`() {
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
    fun `buscarUsuarioPorEmail deve retornar null quando nao encontrado`() {
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
    fun `buscarUsuarioPorEmail deve retornar null quando ocorre excecao`() {
        val testEmail = "error@example.com"

        every { collectionReference.document(testEmail) } returns documentReference
        every { documentReference.get() } throws RuntimeException("Simulated Firestore error")

        val result = usersController.buscarUsuarioPorEmail(testEmail)

        assertNull(result)
    }

    @Test
    fun `buscarUsuarioPorNome deve retornar usuario quando encontrado`() {
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
    fun `buscarUsuarioPorNome deve retornar null quando nao encontrado`() {
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
    fun `buscarUsuarioPorNome deve retornar null quando ocorre excecao`() {
        val testName = "Nome Com Erro"

        every { collectionReference.whereEqualTo("nome", testName) } throws RuntimeException("Erro de busca")

        val result = usersController.buscarUsuarioPorNome(testName)

        assertNull(result)
    }

    @Test
    fun `atualizarUsuario deve retornar true quando a atualizacao e bem-sucedida`() {
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
    fun `atualizarUsuario deve retornar false quando ocorre uma excecao`() {
        val testEmail = "update_fail@example.com"
        val updatedUser = Users(email = testEmail, nome = "Updated Fail User")

        every { collectionReference.document(testEmail) } returns documentReference
        every { documentReference.set(any<Users>()) } throws RuntimeException("Erro na atualização")

        val result = usersController.atualizarUsuario(testEmail, updatedUser)

        assertFalse(result)
        verify { documentReference.set(any<Users>()) }
    }

    @Test
    fun `deletarUsuario deve retornar true quando a delecao e bem-sucedida`() {
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
    fun `deletarUsuario deve retornar false quando ocorre uma excecao`() {
        val testEmail = "delete_fail@example.com"

        every { collectionReference.document(testEmail) } returns documentReference
        every { documentReference.delete() } throws RuntimeException("Erro na deleção")

        val result = usersController.deletarUsuario(testEmail)

        assertFalse(result)
        verify { documentReference.delete() }
    }
}
