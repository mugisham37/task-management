import swaggerJsdoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"
import type { Express } from "express"
import config from "./environment"
import logger from "./logger"

// Swagger definition
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Task Management API",
    version: config.apiVersion,
    description: "A comprehensive task management API with advanced features",
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
    contact: {
      name: "API Support",
      url: "https://taskmanagement.com/support",
      email: "support@taskmanagement.com",
    },
  },
  servers: [
    {
      url: config.apiUrl,
      description: "API Server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      Error: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: false,
          },
          error: {
            type: "object",
            properties: {
              code: {
                type: "string",
                example: "VALIDATION_ERROR",
              },
              message: {
                type: "string",
                example: "Validation error",
              },
              details: {
                type: "array",
                items: {
                  type: "object",
                },
                example: [],
              },
            },
          },
        },
      },
      User: {
        type: "object",
        properties: {
          id: {
            type: "string",
            example: "123e4567-e89b-12d3-a456-426614174000",
          },
          name: {
            type: "string",
            example: "John Doe",
          },
          email: {
            type: "string",
            example: "john@example.com",
          },
          role: {
            type: "string",
            enum: ["user", "admin"],
            example: "user",
          },
          isEmailVerified: {
            type: "boolean",
            example: true,
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2023-01-01T00:00:00.000Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2023-01-01T00:00:00.000Z",
          },
        },
      },
      Task: {
        type: "object",
        properties: {
          id: {
            type: "string",
            example: "123e4567-e89b-12d3-a456-426614174000",
          },
          title: {
            type: "string",
            example: "Complete project documentation",
          },
          description: {
            type: "string",
            example: "Write comprehensive documentation for the project",
          },
          status: {
            type: "string",
            enum: ["todo", "in-progress", "review", "completed"],
            example: "todo",
          },
          priority: {
            type: "string",
            enum: ["low", "medium", "high", "urgent"],
            example: "medium",
          },
          dueDate: {
            type: "string",
            format: "date-time",
            example: "2023-01-15T00:00:00.000Z",
          },
          assigneeId: {
            type: "string",
            example: "123e4567-e89b-12d3-a456-426614174000",
          },
          projectId: {
            type: "string",
            example: "123e4567-e89b-12d3-a456-426614174000",
          },
          createdById: {
            type: "string",
            example: "123e4567-e89b-12d3-a456-426614174000",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2023-01-01T00:00:00.000Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2023-01-01T00:00:00.000Z",
          },
        },
      },
      Project: {
        type: "object",
        properties: {
          id: {
            type: "string",
            example: "123e4567-e89b-12d3-a456-426614174000",
          },
          name: {
            type: "string",
            example: "Website Redesign",
          },
          description: {
            type: "string",
            example: "Redesign the company website",
          },
          status: {
            type: "string",
            enum: ["planning", "active", "on-hold", "completed"],
            example: "active",
          },
          startDate: {
            type: "string",
            format: "date-time",
            example: "2023-01-01T00:00:00.000Z",
          },
          endDate: {
            type: "string",
            format: "date-time",
            example: "2023-03-31T00:00:00.000Z",
          },
          ownerId: {
            type: "string",
            example: "123e4567-e89b-12d3-a456-426614174000",
          },
          workspaceId: {
            type: "string",
            example: "123e4567-e89b-12d3-a456-426614174000",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2023-01-01T00:00:00.000Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2023-01-01T00:00:00.000Z",
          },
        },
      },
      Workspace: {
        type: "object",
        properties: {
          id: {
            type: "string",
            example: "123e4567-e89b-12d3-a456-426614174000",
          },
          name: {
            type: "string",
            example: "My Workspace",
          },
          description: {
            type: "string",
            example: "Main workspace for all projects",
          },
          ownerId: {
            type: "string",
            example: "123e4567-e89b-12d3-a456-426614174000",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2023-01-01T00:00:00.000Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2023-01-01T00:00:00.000Z",
          },
        },
      },
      Team: {
        type: "object",
        properties: {
          id: {
            type: "string",
            example: "123e4567-e89b-12d3-a456-426614174000",
          },
          name: {
            type: "string",
            example: "Development Team",
          },
          description: {
            type: "string",
            example: "Main development team",
          },
          workspaceId: {
            type: "string",
            example: "123e4567-e89b-12d3-a456-426614174000",
          },
          createdById: {
            type: "string",
            example: "123e4567-e89b-12d3-a456-426614174000",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2023-01-01T00:00:00.000Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2023-01-01T00:00:00.000Z",
          },
        },
      },
    },
    responses: {
      UnauthorizedError: {
        description: "Authentication information is missing or invalid",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
          },
        },
      },
      ForbiddenError: {
        description: "User does not have permission to access the resource",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
          },
        },
      },
      NotFoundError: {
        description: "The requested resource was not found",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
          },
        },
      },
      ValidationError: {
        description: "Validation error",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
          },
        },
      },
      ServerError: {
        description: "Internal server error",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
          },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  tags: [
    {
      name: "Auth",
      description: "Authentication operations",
    },
    {
      name: "Users",
      description: "User management operations",
    },
    {
      name: "Tasks",
      description: "Task management operations",
    },
    {
      name: "Projects",
      description: "Project management operations",
    },
    {
      name: "Teams",
      description: "Team management operations",
    },
    {
      name: "Workspaces",
      description: "Workspace management operations",
    },
    {
      name: "Comments",
      description: "Comment operations",
    },
    {
      name: "Notifications",
      description: "Notification operations",
    },
    {
      name: "Analytics",
      description: "Analytics operations",
    },
    {
      name: "Dashboard",
      description: "Dashboard operations",
    },
    {
      name: "Health",
      description: "Health check operations",
    },
    {
      name: "Feedback",
      description: "Feedback operations",
    },
  ],
}

// Swagger options
const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"], // Path to the API routes and controllers
}

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options)

/**
 * Setup Swagger documentation
 * @param app Express application
 */
export const setupSwagger = (app: Express): void => {
  try {
    // Serve swagger docs
    app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpec, {
        explorer: true,
        customCss: ".swagger-ui .topbar { display: none }",
        customSiteTitle: "Task Management API Documentation",
        swaggerOptions: {
          persistAuthorization: true,
          displayRequestDuration: true,
          docExpansion: "none",
          filter: true,
          showExtensions: true,
          showCommonExtensions: true,
        },
      }),
    )

    // Serve swagger spec as JSON
    app.get("/api-docs.json", (req, res) => {
      res.setHeader("Content-Type", "application/json")
      res.send(swaggerSpec)
    })

    logger.info("Swagger documentation initialized at /api-docs")
  } catch (error) {
    logger.error("Failed to initialize Swagger documentation:", error)
  }
}

/**
 * Get Swagger specification
 */
export const getSwaggerSpec = () => swaggerSpec

export default swaggerSpec
