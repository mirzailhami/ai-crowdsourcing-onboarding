import axios from "axios"

// Create API instance with proper error handling
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  timeout: 30000,
})

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error)
    // For development/testing, if there's no backend, return mock success
    // if (error.message === "Network Error" && process.env.NODE_ENV === "development") {
    //   console.log("Development mode: Mocking successful API response")
    //   return Promise.resolve({ data: { id: Math.floor(Math.random() * 1000) } })
    // }
    return Promise.reject(error)
  },
)

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === "development" || !process.env.NEXT_PUBLIC_API_URL

export async function createChallenge(data: any) {
  // In development mode, return mock data without making API call
  // if (isDevelopment) {
  //   console.log("Development mode: Returning mock challenge data")
  //   return { id: Math.floor(Math.random() * 1000) }
  // }

  try {
    console.log("Creating challenge with data:", data)
    const response = await api.post("/challenges", data)
    return response.data
  } catch (error) {
    console.error("Error in createChallenge:", error)
    throw error
  }
}

export async function updateChallenge(id: number, data: any) {
  // In development mode, return mock data without making API call
  // if (isDevelopment) {
  //   console.log("Development mode: Returning mock update success")
  //   return { id, ...data }
  // }

  try {
    console.log(`Updating challenge ${id} with data:`, data)
    const response = await api.put(`/challenges/${id}`, data)
    return response.data
  } catch (error) {
    console.error("Error in updateChallenge:", error)
    throw error
  }
}

export async function createHelpRequest(data: any) {
  // In development mode, return mock data without making API call
  // if (isDevelopment) {
  //   console.log("Development mode: Returning mock help request success")
  //   return { id: Math.floor(Math.random() * 1000), ...data }
  // }

  try {
    const response = await api.post("/help", data)
    return response.data
  } catch (error) {
    console.error("Error in createHelpRequest:", error)
    throw error
  }
}

// Custom function with retry logic for copilot
export interface CopilotRequest {
  messages: {
    role: string
    content: string
    timestamp?: string
    createdAt?: string
    isRetryable?: boolean
  }[]
  context: string[]
  formData: { [key: string]: any }
  step: number
}

export interface CopilotResponse {
  role: string
  content: string
  timestamp: string
  createdAt: string
  suggestions?: string[]
}

export async function fetchCopilot(data: CopilotRequest, maxRetries = 2): Promise<CopilotResponse> {
  // In development mode, return mock data without making API call
  // if (isDevelopment) {
  //   console.log("Development mode: Returning mock copilot response")
  //   return {
  //     role: "assistant",
  //     content: "This is a mock response from the AI assistant for development purposes.",
  //     timestamp: new Date().toISOString(),
  //     createdAt: new Date(),
  //     suggestions: ["Try filling out more details", "Consider adding milestones", "Review your goals"],
  //   }
  // }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await api.post("/copilot", data)
      return response.data
    } catch (error: any) {
      if (attempt === maxRetries || !error.code || error.code !== "ECONNABORTED") {
        throw error
      }
      console.warn(`Retry attempt ${attempt} failed for /copilot, retrying...`)
      await new Promise((resolve) => setTimeout(resolve, 2000 * attempt)) // Exponential backoff
    }
  }

  // This should never be reached due to the throw in the loop, but TypeScript requires a return
  throw new Error("Failed to fetch copilot response after retries")
}
