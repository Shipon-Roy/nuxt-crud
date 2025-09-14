import axios from "axios";

export default function useApi() {
  const config = useRuntimeConfig();

  return axios.create({
    baseURL: "https://my.1tool.com/suite/api",
    withCredentials: true, // cookie save হবে
    headers: {
      Authorization: `Bearer ${config.public.apiToken}`,
      "X-Tenant-ID": config.public.tenantId,
    },
  });
}
