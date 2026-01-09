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
 * @file types/replacer.d.ts
 */
import type { TypedRegExp } from "./regex.d.ts";
import type { RegExpSource } from "./regex-util.d.ts";
import type { IsEmptyRecord } from "./common.d.ts";
import type { CountCaptureGroups, RegExpNamedGroups, CaptureOptTuple } from "./captures.d.ts";
/*!
// ============================================================================
//                          Helper Types for Replacer
// ============================================================================
*/
/**
 * Represents the rest parameters for the `String.prototype.replace()` replacer function,  
 * excluding the `match` parameter.
 *
 * @template R - The `RegExp` type.
 * @template S - The source string of the `RegExp`.
 * @template GroupCount - The number of capture groups in the `RegExp`.
 * @template NamedGroups - The type of named capture groups in the `RegExp`.
 * @returns A tuple type representing the rest parameters of the replacer function.
 */
export type StringReplacerRestArgs<
  R extends RegExp,
  S extends RegExpSource<R> = RegExpSource<R>,
  GroupCount extends number = CountCaptureGroups<S>,
  NamedGroups = RegExpNamedGroups<R>
> = IsEmptyRecord<NamedGroups> extends true ? [
  ...captures: CaptureOptTuple<GroupCount>,
  offset: number,
  input: string,
] : [
  ...captures: CaptureOptTuple<GroupCount>,
  offset: number,
  input: string,
  groups: NamedGroups
];
/**
 * Creates the parameter types for String.replace callback function.
 * 
 * @example
 * type Params = StringReplacerParams<typeof myRegex>;
 * // [match: string, ...captures: string[], offset: number, string: string, groups?: {...}]
 */
export type StringReplacerParams<
  R extends RegExp,
  S extends RegExpSource<R> = RegExpSource<R>,
  GroupCount extends number = CountCaptureGroups<S>,
  NamedGroups = RegExpNamedGroups<R>
> = [
  /** The matched substring. */
  matched: string,
  /**
   * The rest parameters of the replacer function, including captures, offset, input string, and optionally named groups.
   */
  ...StringReplacerRestArgs<R, S, GroupCount, NamedGroups>
];
/**
 * Represents the type of the replacer function used in `String.prototype.replace()`.
 *
 * This type is designed to provide precise type inference for the replacer function's parameters,
 * including `match`, capture groups (both indexed and named), `offset`, `input`, and `groups`.
 *
 * @template R - The `RegExp` type for which the replacer function is being defined.
 */
export type StringReplacerType<R extends RegExp> =
  R extends TypedRegExp<infer P extends string, infer F extends string>
    ? (...args: StringReplacerParams<R>) => string
    : R extends RegExp
      ? (match: string, ...restArgs: any[]) => string
      : string;
export {};