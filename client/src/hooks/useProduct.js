export const useProduct = (id: string) =>
  useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await getProductApi(id)
      return res.data
    },
  })