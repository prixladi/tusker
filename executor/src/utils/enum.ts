type UnionFromTuple<T> = T extends (infer U)[] ? U : never;

const Enum = <T extends string[]>(...args: T) =>
  Object.freeze(
    args.reduce(
      (acc, next) => ({
        ...acc,
        [next]: next,
      }),
      Object.create(null),
    ) as { [P in UnionFromTuple<typeof args>]: P },
  );

export default Enum;
