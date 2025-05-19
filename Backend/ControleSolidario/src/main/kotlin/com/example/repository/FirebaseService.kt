package com.example.controle.service

import com.google.auth.oauth2.GoogleCredentials
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import com.google.firebase.cloud.FirestoreClient
import com.google.cloud.firestore.Firestore
import java.io.FileNotFoundException

class FirebaseService {

    val firestore: Firestore

    init {
        if (FirebaseApp.getApps().isEmpty()) {
            println("🔧 Inicializando Firebase...")
            val serviceAccount = FirebaseService::class.java.classLoader
                .getResourceAsStream("firebase-key.json")
                ?: throw FileNotFoundException("firebase-key.json não encontrado!")

            val options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .setProjectId("controlesolidario")
                .build()

            FirebaseApp.initializeApp(options)
        }

        firestore = FirestoreClient.getFirestore()
    }
}
