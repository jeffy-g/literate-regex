/*!
// Copyright jeffy-g 2026
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
*/
/**
 * @file types/regex-util.d.ts
 */
import type {
  StringLength, StringToUnion
} from "./common.d.ts";
import type {
  TRegexpFlag, TValidRegExpFlag
} from "./parser.d.ts";
/**
 * Extracts the literal type from the source property of a RegExp.
 * @template R - A RegExp type.
 */
export type RegExpSource<R extends RegExp> = R extends RegExp & { readonly source: infer T } ? T : never;
/**
 * Extracts the literal type from the flags property of a RegExp.
 * @template R - A RegExp type.
 */
export type RegExpFlags<R extends RegExp> =
  R extends RegExp & { readonly flags: infer F extends string }
    ? ValidateFlags<F> extends true
      ? F : string
    : string;
/**
 * @internal
 */
type ExceedsMaxRegExpFlagCount<N extends number> =
  number extends N ? boolean :  N extends 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 ? false : true;
/** 
 * Checks if all characters in a string `S` are unique. 
 * 
 * @template S - The input string. 
 * @template Seen - An accumulator for characters encountered so far. 
 * @returns `true` if all characters in `S` are unique, `false` otherwise. 
 * @internal 
 */
type IsUniqueChars<S extends string, Seen extends string = never> =
  S extends `${infer H}${infer T}`
    ? H extends Seen ? false : IsUniqueChars<T, Seen | H>
    : true;
/**
 * Normalizes a string of RegExp flags by sorting them into a predefined order (`dgimsuvy`).  
 * This type is used internally after flags have been validated for uniqueness and allowed characters.
 *
 * @template F - The input string of flags to normalize.
 * @template Order - The desired order of flags (defaults to `TRegexpFlag`).
 * @template Out - An accumulator for the normalized flags.
 * @internal
 */
type NormalizeFlags<
  F extends string, Order extends string = TRegexpFlag, Out extends string = "",
> = Order extends `${infer C}${infer Rest}`
  ? NormalizeFlags<
    F, Rest, F extends `${string}${C}${string}` ? `${Out}${C}` : Out
  > : Out;
/**
 * Canonicalizes a string of RegExp flags by validating them, removing duplicates,  
 * and sorting them into a predefined order (`dgimsuvy`).
 *
 * @template F - The input string of flags.
 */
export type CanonicalFlags<F extends string> =
  [string] extends [F] ? string :
  Exclude<StringToUnion<F>, TValidRegExpFlag> extends never
    ? IsUniqueChars<F> extends true
      ? ExceedsMaxRegExpFlagCount<StringLength<F>> extends true
        ? never
        : NormalizeFlags<F>
      : never
    : never;
/**
 * Checks if a string of RegExp flags is "strict", meaning it contains only valid, unique, and non-excessive flags.
 *
 * @template F - The input string of flags.
 * @returns `true` if the flags are strict, `false` otherwise.
 * @internal
 */
export type IsStrictFlags<F extends string> =
  CanonicalFlags<F> extends never ? false : true;
/**
 * Validates a string of RegExp flags for correctness, including uniqueness and allowed characters.  
 * This type performs a strict validation, ensuring that each flag is valid and appears only once.
 *
 * @template F - The input string of flags to validate.
 * @template Seen - An accumulator for flags encountered so far (used internally to check for duplicates).
 * @returns `true` if the flags are valid and unique, `false` otherwise.
 * @internal
 */
export type ValidateFlags<F extends string, Seen extends string = ""> =
  F extends ""
    ? true
    : IsStrictFlags<F> extends false
    ? false
    : F extends `${infer OneCh}${infer Rest}`
      ? OneCh extends TValidRegExpFlag
        ? OneCh extends Seen
          ? false
          : ValidateFlags<Rest, `${Seen}${OneCh}`>
        : false
      : false;
/**
 * Checks if a given RegExp flag string `F` contains a specific flag character `C`.  
 * This type performs a strict validation of `F` first.
 *
 * @template F - The input string of RegExp flags.
 * @template C - The specific flag character to check for (e.g., `"g"`, `"i"`).
 * @returns `true` if `F` is valid and contains `C`, `false` otherwise.
 * @internal
 */
export type HasStrictRegExpFlag<F extends string, C extends TValidRegExpFlag> =
  ValidateFlags<F> extends true ? F extends `${string}${C}${string}` ? true : false : false;
export {};