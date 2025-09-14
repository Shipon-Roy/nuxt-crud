/* eslint-disable no-undef */
export const useAuth = () => {
  const user = useState("user", () => null);
  const token = useCookie("token", {
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  const tenantId = useState("tenantId", () => null);
  const config = useRuntimeConfig();

  /**
   * Login: POST email/password, receive token & tenant ID
   */
  const login = async (email, password) => {
    try {
      const response = await $fetch(
        "https://my.1tool.com/suite/api/auth/user",
        {
          method: "POST",
          body: { email, password },
        }
      );

      console.log("✅ Login response:", response);

      if (!response.api_token) {
        console.error("❌ No token in login response");
        return false;
      }

      token.value = response.api_token;
      tenantId.value = response.tenant_identifier;

      await fetchUser(); // Load user info

      return true;
    } catch (err) {
      console.error("❌ Login error:", err);
      return false;
    }
  };

  /**
   * Fetch the authenticated user info
   */
  const fetchUser = async () => {
    try {
      const authToken = token.value;
      const tenant = tenantId.value || config.public.TENANT_ID;

      console.log("🧪 Fetching user with token:", authToken);
      console.log("🧪 Using tenant ID:", tenant);

      if (!authToken) {
        console.warn("⚠️ No token found, skipping fetchUser()");
        return;
      }

      // 👇 FIXED: correct endpoint for authenticated user
      const data = await $fetch("https://my.1tool.com/suite/api/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "X-Tenant-ID": tenant,
        },
      });

      user.value = data;
      console.log("✅ User fetched:", data);
    } catch (err) {
      console.error("❌ User fetch failed:", err);
      user.value = null;
    }
  };

  /**
   * Logout the user
   */
  const logout = () => {
    user.value = null;
    token.value = null;
    tenantId.value = null;
  };

  /**
   * Auto-fetch user if token exists and user not yet loaded
   */
  if (import.meta.client && token.value && !user.value) {
    fetchUser();
  }

  return {
    user,
    token,
    login,
    fetchUser,
    logout,
  };
};
