function toResponse<X, T extends { _id: X }>(
  obj: T,
): Omit<T, "_id"> & {
  id: X;
} {
  const { _id, ...rest } = obj;

  return { id: _id, ...rest };
}

export default toResponse;
