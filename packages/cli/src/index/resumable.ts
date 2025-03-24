/**
 * Resumable source
 *
 * @example
 *
 * ```ts
 *
 * const resumable = createResumable('./checkpoint', { enabled: !process.env.DEV });
 *
 * const iterator = resumable<unknown>((state, checkpoint) => (...args) => {
 *   const result = await fetch(...args, state).then((res) => res.json());
 *
 *   checkpoint(result.nextPageParams);
 *
 *   return result.data;
 * }, intialParams);
 *
 * ```
 */

export const createResumable = (params: {
  enabled: boolean;
  store?: IStore<object>;
  path?: string;
}) => {
  const store = params.store || new DiskStore(params.path as string);

  return function resumable<T>(
    handler: (
      state: T | undefined,
      checkpoint: (state: T | undefined) => void
    ) => CallableFunction
  ) {
    // biome-ignore lint/suspicious/noExplicitAny: expected
    return <V extends (...args: any[]) => any>(...args: Parameters<V>) =>
      handler(store.get() as T, (state) => store.set(state as object))(
        ...args
      ) as ReturnType<V>;
  };
};

/**
 * Store
 */

interface IStore<T> {
  get(): T | undefined;
  set(val: T): void;
}

import fs from 'fs';
import { resolve } from 'path';

class DiskStore<T> implements IStore<T> {
  path: string;

  constructor(path: string) {
    this.path = resolve(path);
  }

  get(): T | undefined {
    if (fs.existsSync(this.path))
      return JSON.parse(fs.readFileSync(this.path, 'utf8')) as T;
  }

  set(val: T): void {
    fs.writeFileSync(resolve(this.path), JSON.stringify(val, null, 2));
  }
}

/**
 * Test
 */

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const resumable = createResumable({
  enabled: true,
  path: `${__dirname}/checkpoint1.json`
});

const countLog = resumable<number>(
  (state, checkpoint) => async (message: string) => {
    console.log(state);
    await sleep(100);
    console.log(message);
    checkpoint(state ? state + 1 : 1);
  }
);

countLog('hello world');

// function test<T extends (...args: any[]) => any>(fn: T) {
//   type Fn = <U>(state: U, callback: (param: U) => void) => T;

//   const handle: Fn = (state: any, callback: (arg: any) => any) => {
//     return (...args: any[]): any => {
//       return fn(...args);
//     };
//   };

//   return handle;
// }

// test((a: 1) =)
