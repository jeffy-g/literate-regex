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
import type {
  TypedRegExp,
  RegExpSource,
} from "./regex.d.ts";
import type { IsEmptyRecord } from "./common.d.ts";
import type { CountCaptureGroups, RegExpNamedGroups, CaptureOptTuple } from "./captures.d.ts";
/*!
// ============================================================================
//                          Helper Types for Replacer
// ============================================================================
*/
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
> = IsEmptyRecord<NamedGroups> extends true ? [
  match: string,
  ...captures: CaptureOptTuple<GroupCount>,
  offset: number,
  input: string,
] : [
  match: string,
  ...captures: CaptureOptTuple<GroupCount>,
  offset: number,
  input: string,
  groups: NamedGroups
];
/**
 * string replacer is function or string
 */
export type StringReplacerType<R> =
  R extends TypedRegExp<infer P extends string, infer F extends string>
    ? (...args: StringReplacerParams<TypedRegExp<P, F>, P>) => string
    : R extends RegExp
      ? (match: string, ...rest: any[]) => string
      : string;
export {};