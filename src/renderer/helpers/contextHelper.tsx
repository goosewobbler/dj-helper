import { Provider, createContext, useContext } from 'react';
import { AnyObject } from '../../common/types';

export function createCtx<A extends AnyObject>(): readonly [() => A, Provider<A | undefined>] {
  const ctx = createContext<A | undefined>(undefined);
  function useCtx(): A {
    const c = useContext(ctx);
    if (c === undefined) {
      throw new Error('useCtx must be inside a Provider with a value');
    }
    return c;
  }
  return [useCtx, ctx.Provider] as const; // 'as const' makes TypeScript infer a tuple
}

// export function createCtx<A>(
//   defaultValue: A | {} = {},
// ): readonly [Context<{ state: A | {}; update: Dispatch<SetStateAction<A | {}>> }>, Function] {
//   type UpdateType = Dispatch<SetStateAction<typeof defaultValue>>;
//   const defaultUpdate: UpdateType = () => defaultValue;
//   const ctx = createContext({
//     state: defaultValue,
//     update: defaultUpdate,
//   });
//   function Provider({ children }: PropsWithChildren<{}>): ReactElement {
//     const [state, update] = useState(defaultValue);
//     return <ctx.Provider value={{ state, update }}>{children}</ctx.Provider>;
//   }
//   return [ctx, Provider] as const;
// }
