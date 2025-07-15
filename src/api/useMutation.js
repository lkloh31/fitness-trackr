import { useState } from "react";
import { useApi } from "./ApiContext";

/**
 * Returns a function to mutate some data via the API, as well as some state
 * that tracks the response of that mutation request.
 */
export default function useMutation(method, resource, tagsToInvalidate) {
  const { request, invalidateTags } = useApi();

  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async (body, customResource = null) => {
    setLoading(true);
    setError(null);
    try {
      const targetResource = customResource || resource;
      const result = await request(targetResource, {
        method,
        body: body ? JSON.stringify(body) : undefined,
      });
      setData(result);
      invalidateTags(tagsToInvalidate);
    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return { mutate, data, loading, error };
}
