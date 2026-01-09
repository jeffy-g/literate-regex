/*!
// Copyright jeffy-g 2025
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
 * @file types/common.d.ts
 */
/**
 * Combines an intersection of object types into a single object type.
 * 
 * @template IS The intersection of object types to combine.
 * @returns {Record<string, unknown>} A single object type with all properties from the intersection.
 * 
 * @example
 * type Combined = CombineIntersection<{ a: string } & { b: number }>;
 * // Result: { a: string; b: number }
 */
export type CombineIntersection<IS> =
  true extends 0 ? { [K in keyof IS]: IS[K] } : { [K in keyof IS]: IS[K] };
/**
 * Creates a tuple type of a specified length, with all elements being of a given type.
 * @template Count - The desired length of the tuple.
 * @template ArrayType - The type of each element in the tuple.
 */
export type TupleOf<
  Count extends number, ArrayType,
  Result extends ArrayType[] = []
> = Result["length"] extends Count
  ? Result
  : TupleOf<Count, ArrayType, [...Result, ArrayType]>;
/**
 * Checks if a given type `T` represents an empty record or `undefined`.
 * @template T - The type to check.
 * @returns `true` if `T` is `undefined` or has no keys, otherwise `false`.
 */
export type IsEmptyRecord<T> =
  [T] extends [undefined] ? true :
  [keyof T] extends [never] ? true : false;
/**
 * StringToUnion<"abc"> -> "a" | "b" | "c"
 * StringToUnion<string> -> string
 *
 * Note: splits by UTF-16 code units (like JS `.split("")`).
 */
export type StringToUnion<S extends string> =
  [string] extends [S]
    ? string
    : S extends `${infer H}${infer T}`
      ? H | StringToUnion<T>
      : never;
/**
 * StringLength<S> -> length as a number literal, or `number` if S is not a literal.
 *
 * - StringLength<"">            -> 0
 * - StringLength<"abc">         -> 3
 * - StringLength<string>        -> number
 * - StringLength<`a${string}`>  -> number
 *
 * Note: counts UTF-16 code units (like JS `.length`).
 */
export type StringLength<S extends string, Acc extends unknown[] = []> =
  [string] extends [S]
    ? number
    : S extends `${infer _H}${infer T}`
      ? StringLength<T, [unknown, ...Acc]>
      : Acc["length"];
export {};