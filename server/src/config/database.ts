import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import config from "./environment"
import logger from "./logger"
import * as schema from "../db/schema"

// PostgreSQL connection pool configuration
const pool = new Pool({
  connectionString: config.databaseUrl,
  max: 20, // Maximum number of clients in the pool
  min: 5, // Minimum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 10000, // Return an error after 10 seconds if connection could not be established
  ssl: config.nodeEnv === "production" ? { rejectUnauthorized: false } : false,
})

// Initialize Drizzle ORM with schema
export const db = drizzle(pool, { schema })

/**
 * Test database connection
 * @returns Connection status
 */
export const testConnection = async (): Promise<boolean> => {
  try {
    const client = await pool.connect()
    await client.query("SELECT NOW()")
    client.release()
    logger.info("✅ Database connection successful")
    return true
  } catch (error) {
    logger.error("❌ Database connection failed:", error)
    return false
  }
}

/**
 * Close database connection pool
 */
export const closeConnection = async (): Promise<void> => {
  try {
    await pool.end()
    logger.info("✅ Database connection pool closed")
  } catch (error) {
    logger.error("❌ Error closing database connection pool:", error)
    throw error
  }
}

/**
 * Get database connection pool stats
 */
export const getPoolStats = () => {
  return {
    totalCount: pool.totalCount,
    idleCount: pool.idleCount,
    waitingCount: pool.waitingCount,
  }
}

/**
 * Initialize database connection
 */
export const initializeDatabase = async (): Promise<void> => {
  try {
    const connected = await testConnection()
    if (!connected) {
      throw new Error("Failed to connect to PostgreSQL database")
    }

    // Log pool configuration
    logger.info("Database pool configuration:", {
      max: pool.options.max,
      min: pool.options.min,
      idleTimeoutMillis: pool.options.idleTimeoutMillis,
      connectionTimeoutMillis: pool.options.connectionTimeoutMillis,
    })

    logger.info("Database initialization completed")
  } catch (error) {
    logger.error("Database initialization failed:", error)
    throw error
  }
}

/**
 * Health check for database
 */
export const checkDatabaseHealth = async (): Promise<{
  connected: boolean
  poolStats: ReturnType<typeof getPoolStats>
  latency?: number
}> => {
  const startTime = Date.now()
  
  try {
    const connected = await testConnection()
    const latency = Date.now() - startTime
    
    return {
      connected,
      poolStats: getPoolStats(),
      latency,
    }
  } catch (error) {
    logger.error("Database health check failed:", error)
    return {
      connected: false,
      poolStats: getPoolStats(),
    }
  }
}

/**
 * Execute a raw SQL query (use with caution)
 */
export const executeRawQuery = async (query: string, params?: any[]): Promise<any> => {
  const client = await pool.connect()
  try {
    const result = await client.query(query, params)
    return result.rows
  } catch (error) {
    logger.error("Raw query execution failed:", error)
    throw error
  } finally {
    client.release()
  }
}

// Handle graceful shutdown
process.on("SIGINT", async () => {
  logger.info("Received SIGINT, closing database connections...")
  await closeConnection()
  process.exit(0)
})

process.on("SIGTERM", async () => {
  logger.info("Received SIGTERM, closing database connections...")
  await closeConnection()
  process.exit(0)
})

// Export pool for direct access if needed
export { pool }

// Export default as the primary database connection
export default db
