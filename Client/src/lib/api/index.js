function getDefaultHeaders(includeContent) {
  const headers = {};
  if (includeContent) {
    headers["Content-type"] = "application/json";
  }

  let token = cookieStore.get("jwt_token")?.value;
  // if (token) {
  //   headers["Authorization"] = `Bearer ${cookieStore.get("jwt_token")?.value}`;
  // }

  return headers;
}

async function apiClient(endpoint, options, method) {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;
    // Add any necessary headers or configurations to the 'options' object
    const requestOptions = {
      headers: {
        ...getDefaultHeaders(
          options.body && options.body instanceof FormData ? false : true
        ),
      },
    };
    // Execute the API request
    const response =
      method === "GET" || method === "DELETE"
        ? await fetch(url, { headers: requestOptions.headers, method: method })
        : await fetch(url, {
            ...requestOptions,
            method,
            body: JSON.stringify(options),
          });

    if (!response.ok) {
      throw new Error(
        (await response.text()) || "An error occurred during the API request"
      );
    }
    if (method === "DELETE") {
      return await response.text();
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

// class

class ApiClient {
  constructor() {
    this.getAsync = this.getAsync.bind(this);
    this.deleteAsync = this.deleteAsync.bind(this);
    this.postAsync = this.postAsync.bind(this);
    this.putAsync = this.putAsync.bind(this);
  }

  async getAsync(endpoint, options = {}) {
    return await apiClient(endpoint, options, "GET");
  }

  async deleteAsync(endpoint, options = {}) {
    return await apiClient(endpoint, options, "DELETE");
  }

  async postAsync(endpoint, options = {}) {
    return await apiClient(endpoint, options, "POST");
  }

  async putAsync(endpoint, options = {}) {
    return await apiClient(endpoint, options, "PUT");
  }
}

export default new ApiClient();
