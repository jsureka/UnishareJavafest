function getDefaultHeaders(content, includeContent) {
  const headers = {};
  if (!includeContent) {
    headers["Content-type"] = `application/json`;
  } else {
  }
  let token = localStorage.getItem("jwt_token");
  if (token !== null) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function apiClient(endpoint, options, method, isFormData) {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;
    // Add any necessary headers or configurations to the 'options' object
    const requestOptions = {
      headers: {
        ...getDefaultHeaders(options, false),
      },
      formDataHeader: {
        ...getDefaultHeaders(options, true),
      },
    };

    const response =
      method === "GET" || method === "DELETE"
        ? await fetch(url, {
            headers: requestOptions.headers,
            method: method,
            // mode: "no-cors",
          })
        : isFormData
        ? await fetch(url, {
            headers: requestOptions.formDataHeader,
            method: method,
            body: options,
            //   mode: "no-cors",
          })
        : await fetch(url, {
            headers: requestOptions.headers,
            method: method,
            body: JSON.stringify(options),
            //    mode: "no-cors",
          });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.errorResponse || "An error occurred during the API request"
      );
    }
    if (method === "DELETE") {
      return await response.text();
    }
    const result = await response.json();
    return result.successResponse;
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
    return await apiClient(endpoint, options, "GET", false);
  }

  async postFormAsync(endpoint, options = {}) {
    return await apiClient(endpoint, options, "POST", true);
  }

  async deleteAsync(endpoint, options = {}) {
    return await apiClient(endpoint, options, "DELETE", false);
  }

  async postAsync(endpoint, options = {}) {
    return await apiClient(endpoint, options, "POST", false);
  }

  async putAsync(endpoint, options = {}) {
    return await apiClient(endpoint, options, "PUT", false);
  }
}

export default new ApiClient();
