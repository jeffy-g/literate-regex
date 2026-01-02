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
  StringLength,
  StringToUnion,
} from "./common.d.ts";
import type {
  TRegexpFlag,
  TValidRegExpFlag,
} from "./parser.d.ts";
/**
 * @internal
 */
type ExceedsMaxRegExpFlagCount<N extends number> =
  number extends N ? boolean :  N extends 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 ? false : true;
/**
 * @internal
 */
type IsUniqueChars<S extends string, Seen extends string = never> =
  S extends `${infer H}${infer T}`
    ? H extends Seen ? false : IsUniqueChars<T, Seen | H>
    : true;
/**
 * @internal
 */
type NormalizeFlags<
  F extends string, Order extends string = TRegexpFlag, Out extends string = "",
> = Order extends `${infer C}${infer Rest}`
  ? NormalizeFlags<
    F, Rest, F extends `${string}${C}${string}` ? `${Out}${C}` : Out
  > : Out;
export type CanonicalFlags<F extends string> =
  [string] extends [F] ? string :
  Exclude<StringToUnion<F>, TValidRegExpFlag> extends never
    ? IsUniqueChars<F> extends true
      ? ExceedsMaxRegExpFlagCount<StringLength<F>> extends true
        ? never
        : NormalizeFlags<F>
      : never
    : never;
export type IsStrictFlags<F extends string> =
  CanonicalFlags<F> extends never ? false : true;
type ValidateFlags<F extends string, Seen extends string = ""> =
  F extends ""
    ? true
    : IsStrictFlags<F> extends false
    ? false
    : F extends `${infer C}${infer Rest}`
      ? C extends TValidRegExpFlag
        ? C extends Seen
          ? false
          : ValidateFlags<Rest, `${Seen}${C}`>
        : false
      : false;
export type RegExpFlags<R extends RegExp> =
  R extends RegExp & { readonly flags: infer F extends string }
    ? ValidateFlags<F> extends true
      ? F : string
    : string;
/**
 * @internal
 */
export type HasStrictRegExpFlag<F extends string, C extends TValidRegExpFlag> =
  ValidateFlags<F> extends true ? F extends `${string}${C}${string}` ? true : false : false;
export {};