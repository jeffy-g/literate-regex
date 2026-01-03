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
 * @file types/regex.d.ts
 */
import type {
  CountCaptureGroups,
  RegExpNamedGroups,
  RegExpIndicesArray,
  RegExpExecArrayFixedPretty,
} from "./captures.d.ts";
import type { RegExpFlags, HasStrictRegExpFlag } from "./regex-util.d.ts";
import type { StringReplacerType } from "./replacer.d.ts";
declare const __typedRegExpBrand: unique symbol;
/**
 * DO NOT USE CONSUMER
 * @internal
 */
type TypedRegExpBrand = { readonly [__typedRegExpBrand]: true };
/**
 * + v0.3.0 feature
 * 
 * @since v0.3.0
 */
export type TypedRegExpTypes<
  R extends RegExp,
  S extends RegExpSource<R> = RegExpSource<R>,
  NamedGroups = RegExpNamedGroups<R>,
  GroupCount extends number = CountCaptureGroups<S>,
  IsTypedRegExp = R extends TypedRegExpBrand ? true : false,
  GROUPS = true extends IsTypedRegExp ? NamedGroups : never,
  EXEC = true extends IsTypedRegExp ? RegExpExecArrayFixedPretty<R, S, GroupCount, NamedGroups> : never,
  REPLACER = true extends IsTypedRegExp ? StringReplacerType<R> : never,
  INDICES = true extends IsTypedRegExp ? RegExpIndicesArray<GroupCount, NamedGroups> : never,
> = true extends IsTypedRegExp ? {
  groups: GROUPS;
  exec: EXEC | null;
  replacer: REPLACER;
  indices: HasStrictRegExpFlag<RegExpFlags<R>, "d"> extends true ? INDICES : never;
} : never;
/**
 * @since 2025/12/24 12:27:39
 * @commit js-dev-tool@6ff89180acfb53c1a0bf9aebadfa12b210bfb3f8
 */
export type TypedRegExp<P extends string, F extends string = ""> = RegExp & {
  readonly source: P;
  readonly flags: F;
} & TypedRegExpBrand & {
  types: TypedRegExpTypes<TypedRegExp<P, F>>;
  global: HasStrictRegExpFlag<F, "g">;
  dotAll: HasStrictRegExpFlag<F, "s">;
  hasIndices: HasStrictRegExpFlag<F, "d">;
  ignoreCase: HasStrictRegExpFlag<F, "i">;
  multiline: HasStrictRegExpFlag<F, "m">;
  sticky: HasStrictRegExpFlag<F, "y">;
  unicode: HasStrictRegExpFlag<F, "u">;
  unicodeSets: HasStrictRegExpFlag<F, "v">;
};
/**
 * Extracts the literal type from the source property of a RegExp.
 * @template R - A RegExp type.
 */
export type RegExpSource<R extends RegExp> = R extends RegExp & { readonly source: infer T } ? T : never;
/**
 * @deprecated description
 */
export declare function createRegExp<
  const P extends string,
  const F extends string = ""
>(pattern: P, flags?: F): TypedRegExp<P, F>;
export {};