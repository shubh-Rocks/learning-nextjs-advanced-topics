const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async request(endpoint: string, options: RequestInit = {}) {
    // Ab ye banega: "" + "/api/auth/register" = "/api/auth/register"
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      headers: {
        "Content-type": "application/json",
        ...options.headers,
      },
      credentials: "include",
      ...options,
    };
    const response = await fetch(url, config);

    if (response.status === 401) {
      return null;
    }

    // Yahan maine minor fix kiya hai: return response.json() miss ho raha tha success ke case mein
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: "Network error",
      }));
      throw new Error(error.error || "Request failed");
    }

    return response.json(); // ✅ Added this so your components actually get the data!
  }

  // Auth Methods
  async register(userData: unknown) {
    return this.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async login(email: string, password: string) {
    return this.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    return this.request("/api/auth/logout", {
      method: "POST",
    });
  }

  async getCurrentUser() {
    return this.request("/api/auth/me");
  }

  // User Methods
  async getUsers() {
    return this.request("/api/users");
  }

  // Admin Methods
  async updateUserRole(userId: string, role: string) {
    return this.request(`/api/user/${userId}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    });
  }

  async assignUserteam(userId: string, teamId: string | null) {
    return this.request(`/api/user/${userId}/team`, {
      method: "PATCH",
      body: JSON.stringify({ teamId }),
    });
  }
}

export const apiClient = new ApiClient();
