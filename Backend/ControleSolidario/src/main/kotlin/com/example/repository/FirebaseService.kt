package com.example.ControleSolidario.repository

import com.example.ControleSolidario.model.Doacao
import com.google.gson.Gson
import java.net.HttpURLConnection
import java.net.URL
import java.nio.charset.StandardCharsets

class FirebaseService {

    private val firebaseUrl = "https://controlesolidario-default-rtdb.firebaseio.com/Doacao.json"

    fun inserirDoacao(doacao: Doacao): Boolean {
        val url = URL(firebaseUrl)
        val connection = url.openConnection() as HttpURLConnection

        connection.requestMethod = "POST"
        connection.doOutput = true
        connection.setRequestProperty("Content-Type", "application/json")

        val json = Gson().toJson(doacao)
        val outputBytes = json.toByteArray(StandardCharsets.UTF_8)
        connection.outputStream.write(outputBytes)

        return connection.responseCode == 200
    }
}
