declare const test: (name: string, fn: () => void) => void;

// HELPERS

function sum(ns: Array<number>): number {
  return ns.reduce((result, n) => result + n, 0);
}

// FUZZERS

export class Fuzzer<Type> {
  private generator: (prng: number) => Type;

  private constructor(func: (prng: number) => Type) {
    this.generator = func;
  }

  /** Generate an int.
   *
   * This does not include NaN, Infinity, or -Infinity.
   */
  public static int: Fuzzer<number> = new Fuzzer((prng) => {
    // Favor smaller values
    const weighted = prng ** 30;

    if (prng < 0.5) {
      return Math.ceil(weighted * Number.MIN_SAFE_INTEGER);
    }
    else {
      return Math.floor(weighted * Number.MAX_SAFE_INTEGER);
    }
  });

  /** Generate an int between min and max, inclusive. */
  public static intRange(min: number, max: number): Fuzzer<number> {
    return new Fuzzer((prng) => Math.floor(prng * (max + 1 - min) + min));
  }

  /** Generate a float.
   *
   * This does not include NaN, Infinity, or -Infinity.
   */
  public static float: Fuzzer<number> = new Fuzzer((prng) => {
    // Use int fuzzer to favor smaller values
    const whole = Fuzzer.int.generate();

    return whole + prng;
  });

  /** Generate a random string of ASCII characters.
   *
   * Favors smaller strings.
   */
  public static string: Fuzzer<string> = new Fuzzer((prng) => {
    // Favor shorter strings
    const length = Fuzzer.intRange(0, 1000).generate();

    return Array(length).fill(null).map(() => {
      const char = Fuzzer.intRange(32, 126).generate(); // printable ASCII

      return String.fromCharCode(char);
    }).join('');
  });

  /** Generate a "random" constant. ;)
   *
   * Useful when defining larger fuzzers and you need hardcoded values.
   */
  public static constant<A>(value: A): Fuzzer<A> {
    return new Fuzzer((prng) => value);
  }

  /** Given a fuzzer of some type, generate an array full of that type.
   *
   * This does not include NaN, Infinity, or -Infinity.
   */
  public static array<A>(fuzzer: Fuzzer<A>): Fuzzer<Array<A>> {
    return new Fuzzer((prng) => {
      // Favor smaller arrays
      const length = Math.floor(400 * (prng ** 30));

      return Array(length).fill(null).map(() => fuzzer.generate());
    });
  }

  // STATIC METHODS

  /** Use a fuzzer to create a new random value. */
  public static generate<A>(fuzzer: Fuzzer<A>) {
    return fuzzer.generator(Math.random());
  }

  /** Transform the result of a fuzzer.
   *
   * Useful with intRange and switch statements to create one of several variants.
   */
  public static map <A, B>(
    fuzzer: Fuzzer<A>,
    mapper: (value: A) => B,
  ): Fuzzer<B> {
    return new Fuzzer((prng) => mapper(fuzzer.generate()));
  }

  /** Transforms the result of two fuzzers. */
  public static map2 <A, B, C>(
    fuzzerA: Fuzzer<A>,
    fuzzerB: Fuzzer<B>,
    mapper: (a: A, b: B) => C,
  ): Fuzzer<C> {
    return new Fuzzer((prng) => mapper(fuzzerA.generate(), fuzzerB.generate()));
  }

  /** Transforms the result of three fuzzers. */
  public static map3 <A, B, C, D>(
    fuzzerA: Fuzzer<A>,
    fuzzerB: Fuzzer<B>,
    fuzzerC: Fuzzer<C>,
    mapper: (a: A, b: B, c: C) => D,
  ): Fuzzer<D> {
    return new Fuzzer((prng) => mapper(
      fuzzerA.generate(),
      fuzzerB.generate(),
      fuzzerC.generate(),
    ));
  }

  /** Transforms the result of four fuzzers. */
  public static map4 <A, B, C, D, E>(
    fuzzerA: Fuzzer<A>,
    fuzzerB: Fuzzer<B>,
    fuzzerC: Fuzzer<C>,
    fuzzerD: Fuzzer<D>,
    mapper: (a: A, b: B, c: C, d: D) => E,
  ): Fuzzer<E> {
    return new Fuzzer((prng) => mapper(
      fuzzerA.generate(),
      fuzzerB.generate(),
      fuzzerC.generate(),
      fuzzerD.generate(),
    ));
  }

  /** Transforms the result of five fuzzers. */
  public static map5 <A, B, C, D, E, F>(
    fuzzerA: Fuzzer<A>,
    fuzzerB: Fuzzer<B>,
    fuzzerC: Fuzzer<C>,
    fuzzerD: Fuzzer<D>,
    fuzzerE: Fuzzer<E>,
    mapper: (a: A, b: B, c: C, d: D, e: E) => F,
  ): Fuzzer<F> {
    return new Fuzzer((prng) => mapper(
      fuzzerA.generate(),
      fuzzerB.generate(),
      fuzzerC.generate(),
      fuzzerD.generate(),
      fuzzerE.generate(),
    ));
  }

  /** Transforms the result of six fuzzers. */
  public static map6 <A, B, C, D, E, F, G>(
    fuzzerA: Fuzzer<A>,
    fuzzerB: Fuzzer<B>,
    fuzzerC: Fuzzer<C>,
    fuzzerD: Fuzzer<D>,
    fuzzerE: Fuzzer<E>,
    fuzzerF: Fuzzer<F>,
    mapper: (a: A, b: B, c: C, d: D, e: E, f: F) => G,
  ): Fuzzer<G> {
    return new Fuzzer((prng) => mapper(
      fuzzerA.generate(),
      fuzzerB.generate(),
      fuzzerC.generate(),
      fuzzerD.generate(),
      fuzzerE.generate(),
      fuzzerF.generate(),
    ));
  }

  /** Transforms the result of seven fuzzers. */
  public static map7 <A, B, C, D, E, F, G, H>(
    fuzzerA: Fuzzer<A>,
    fuzzerB: Fuzzer<B>,
    fuzzerC: Fuzzer<C>,
    fuzzerD: Fuzzer<D>,
    fuzzerE: Fuzzer<E>,
    fuzzerF: Fuzzer<F>,
    fuzzerG: Fuzzer<G>,
    mapper: (a: A, b: B, c: C, d: D, e: E, f: F, g: G) => H,
  ): Fuzzer<H> {
    return new Fuzzer((prng) => mapper(
      fuzzerA.generate(),
      fuzzerB.generate(),
      fuzzerC.generate(),
      fuzzerD.generate(),
      fuzzerE.generate(),
      fuzzerF.generate(),
      fuzzerG.generate(),
    ));
  }

  /** Transforms the result of eight fuzzers. */
  public static map8 <A, B, C, D, E, F, G, H, I>(
    fuzzerA: Fuzzer<A>,
    fuzzerB: Fuzzer<B>,
    fuzzerC: Fuzzer<C>,
    fuzzerD: Fuzzer<D>,
    fuzzerE: Fuzzer<E>,
    fuzzerF: Fuzzer<F>,
    fuzzerG: Fuzzer<G>,
    fuzzerH: Fuzzer<H>,
    mapper: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H) => I,
  ): Fuzzer<I> {
    return new Fuzzer((prng) => mapper(
      fuzzerA.generate(),
      fuzzerB.generate(),
      fuzzerC.generate(),
      fuzzerD.generate(),
      fuzzerE.generate(),
      fuzzerF.generate(),
      fuzzerG.generate(),
      fuzzerH.generate(),
    ));
  }

  // INSTANCE METHODS
  //
  // These just allow a fluent interface on Fuzzers; they're just the static
  // methods under the hood. See the static method with the same name.

  public map<B>(mapper: (value: Type) => B): Fuzzer<B> {
    return Fuzzer.map(this, mapper);
  }

  public map2<B, C>(fuzzerB: Fuzzer<B>, mapper: (a: Type, b: B) => C): Fuzzer<C> {
    return Fuzzer.map2(this, fuzzerB, mapper);
  }

  public map3<B, C, D>(
    fuzzerB: Fuzzer<B>,
    fuzzerC: Fuzzer<C>,
    mapper: (a: Type, b: B, c: C) => D,
  ): Fuzzer<D> {
    return Fuzzer.map3(this, fuzzerB, fuzzerC, mapper);
  }

  public map4<B, C, D, E>(
    fuzzerB: Fuzzer<B>,
    fuzzerC: Fuzzer<C>,
    fuzzerD: Fuzzer<D>,
    mapper: (a: Type, b: B, c: C, d: D) => E,
  ): Fuzzer<E> {
    return Fuzzer.map4(this, fuzzerB, fuzzerC, fuzzerD, mapper);
  }

  public map5<B, C, D, E, F>(
    fuzzerB: Fuzzer<B>,
    fuzzerC: Fuzzer<C>,
    fuzzerD: Fuzzer<D>,
    fuzzerE: Fuzzer<E>,
    mapper: (a: Type, b: B, c: C, d: D, e: E) => F,
  ): Fuzzer<F> {
    return Fuzzer.map5(this, fuzzerB, fuzzerC, fuzzerD, fuzzerE, mapper);
  }

  public map6<B, C, D, E, F, G>(
    fuzzerB: Fuzzer<B>,
    fuzzerC: Fuzzer<C>,
    fuzzerD: Fuzzer<D>,
    fuzzerE: Fuzzer<E>,
    fuzzerF: Fuzzer<F>,
    mapper: (a: Type, b: B, c: C, d: D, e: E, f: F) => G,
  ): Fuzzer<G> {
    return Fuzzer.map6(
      this,
      fuzzerB,
      fuzzerC,
      fuzzerD,
      fuzzerE,
      fuzzerF,
      mapper,
    );
  }

  public map7<B, C, D, E, F, G, H>(
    fuzzerB: Fuzzer<B>,
    fuzzerC: Fuzzer<C>,
    fuzzerD: Fuzzer<D>,
    fuzzerE: Fuzzer<E>,
    fuzzerF: Fuzzer<F>,
    fuzzerG: Fuzzer<G>,
    mapper: (a: Type, b: B, c: C, d: D, e: E, f: F, g: G) => H,
  ): Fuzzer<H> {
    return Fuzzer.map7(
      this,
      fuzzerB,
      fuzzerC,
      fuzzerD,
      fuzzerE,
      fuzzerF,
      fuzzerG,
      mapper,
    );
  }

  public map8<B, C, D, E, F, G, H, I>(
    fuzzerB: Fuzzer<B>,
    fuzzerC: Fuzzer<C>,
    fuzzerD: Fuzzer<D>,
    fuzzerE: Fuzzer<E>,
    fuzzerF: Fuzzer<F>,
    fuzzerG: Fuzzer<G>,
    fuzzerH: Fuzzer<H>,
    mapper: (a: Type, b: B, c: C, d: D, e: E, f: F, g: G, h: H) => I,
  ): Fuzzer<I> {
    return Fuzzer.map8(
      this,
      fuzzerB,
      fuzzerC,
      fuzzerD,
      fuzzerE,
      fuzzerF,
      fuzzerG,
      fuzzerH,
      mapper,
    );
  }

  public generate(): Type {
    return Fuzzer.generate(this);
  }
}

// TESTS

const TEST_PASSES = 100;

export function fuzz <A>(
  fuzzer: Fuzzer<A>,
  desc: string,
  func: (value: A) => void,
): void {
  test(desc, () => {
    for (let i = 0; i < TEST_PASSES; i += 1) {
      const a = fuzzer.generate();

      func(fuzzer.generate());
    }
  });
}

export function fuzz2 <A, B>(
  fuzzerA: Fuzzer<A>,
  fuzzerB: Fuzzer<B>,
  desc: string,
  func: (a: A, b: B) => void,
): void {
  test(desc, () => {
    for (let i = 0; i < TEST_PASSES; i += 1) {
      func(fuzzerA.generate(), fuzzerB.generate());
    }
  });
}

export function fuzz3 <A, B, C>(
  fuzzerA: Fuzzer<A>,
  fuzzerB: Fuzzer<B>,
  fuzzerC: Fuzzer<C>,
  desc: string,
  func: (a: A, b: B, c: C) => void,
): void {
  test(desc, () => {
    for (let i = 0; i < TEST_PASSES; i += 1) {
      func(fuzzerA.generate(), fuzzerB.generate(), fuzzerC.generate());
    }
  });
}

export function fuzzExplained <A>(
  fuzzer: Fuzzer<A>,
  desc: string,
  func: (value: A) => void,
): void {
  for (let i = 0; i < TEST_PASSES; i += 1) {
    const a = fuzzer.generate();

    test(`${desc} (input: ${String(a)})`, () => {
      func(a);
    });
  }
}

export function fuzz2Explained <A, B>(
  fuzzerA: Fuzzer<A>,
  fuzzerB: Fuzzer<B>,
  desc: string,
  func: (a: A, b: B) => void,
): void {
  for (let i = 0; i < TEST_PASSES; i += 1) {
    const a = fuzzerA.generate();
    const b = fuzzerB.generate();

    test(`${desc} (inputs: "${String(a)}", "${String(b)})`, () => {
      func(a, b);
    });
  }
}

export function fuzz3Explained <A, B, C>(
  fuzzerA: Fuzzer<A>,
  fuzzerB: Fuzzer<B>,
  fuzzerC: Fuzzer<C>,
  desc: string,
  func: (a: A, b: B, c: C) => void,
): void {
  for (let i = 0; i < TEST_PASSES; i += 1) {
    const a = fuzzerA.generate();
    const b = fuzzerB.generate();
    const c = fuzzerC.generate();

    test(
      `${desc} (inputs: "${String(a)}", "${String(b)}", "${String(c)})`,
      () => {
        func(a, b, c);
      },
    );
  }
}
