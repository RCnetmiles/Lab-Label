import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type VerifyAnswerRequest, type VerifyAnswerResponse } from "@shared/routes";
import { type Product } from "@shared/schema";

export function useProducts() {
  return useQuery({
    queryKey: [api.products.list.path],
    queryFn: async () => {
      const res = await fetch(api.products.list.path);
      if (!res.ok) throw new Error("Failed to fetch products");
      // Use the Zod schema to parse and return
      return api.products.list.responses[200].parse(await res.json());
    },
    staleTime: Infinity, // Products don't change during a session
  });
}

export function useVerifyAnswer() {
  return useMutation({
    mutationFn: async (data: VerifyAnswerRequest) => {
      const res = await fetch(api.products.verify.path, {
        method: api.products.verify.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to verify answer");
      }
      return api.products.verify.responses[200].parse(await res.json());
    },
  });
}
