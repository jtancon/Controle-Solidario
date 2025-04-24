package com.exemplo.repository

import com.exemplo.model.Ong
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface OngRepository : JpaRepository<Ong, Long>