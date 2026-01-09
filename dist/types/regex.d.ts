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
import type { CombineIntersection } from "./common.d.ts";
import type {
  CountCaptureGroups,
  RegExpNamedGroups,
  RegExpIndicesArray,
  RegExpExecArrayFixedPretty,
} from "./captures.d.ts";
import type {
  RegExpFlags, RegExpSource,　HasStrictRegExpFlag
} from "./regex-util.d.ts";
import type {
  StringReplacerParams,
} from "./replacer.d.ts";
declare const __typedRegExpBrand: unique symbol;
/**
 * DO NOT USE CONSUMER
 * @internal
 */
export type TypedRegExpBrand = { readonly [__typedRegExpBrand]: true };
/**
 * + v0.3.0 feature
 *
 * Represents the detailed type information extracted from a `TypedRegExp` instance.  
 * This includes types for named capture groups, `exec` method results,  
 * `replace` method replacer functions, and `indices` array (if the 'd' flag is present).
 * 
 * @since v0.3.0
 */
export type TypedRegExpTypes<
  R extends RegExp,
  SOURCE extends RegExpSource<R> = RegExpSource<R>,
  FLAGS extends RegExpFlags<R> = RegExpFlags<R>,
  NamedGroups = RegExpNamedGroups<R>,
  GroupCount extends number = CountCaptureGroups<SOURCE>,
  IsTypedRegExp = R extends TypedRegExpBrand ? true : false,
  GROUPS = true extends IsTypedRegExp ? NamedGroups : never,
  EXEC = true extends IsTypedRegExp ? RegExpExecArrayFixedPretty<R, SOURCE, GroupCount, NamedGroups> : never,
  REPLACER = true extends IsTypedRegExp ? (...args: StringReplacerParams<TypedRegExpCore<SOURCE, FLAGS>>) => string : never,
  INDICES = true extends IsTypedRegExp ? RegExpIndicesArray<GroupCount, NamedGroups> : never,
> = true extends IsTypedRegExp ? {
  groups: GROUPS;
  exec: EXEC | null;
  replacer: REPLACER;
  indices: HasStrictRegExpFlag<FLAGS, "d"> extends true ? INDICES : never;
  typeSystemMessage: "healthy";
} : never;
/**
 * Watch the regex flags (If flags are statically defined, the state of the flag is bound)
 */
export type RegExpFlagPart<R extends RegExp> = Pick<R, "global" | "dotAll" | "hasIndices" | "ignoreCase" | "multiline" | "sticky" | "unicode" | "unicodeSets">;
export type TypedRegExpFlagPart<F extends string> = {
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
 * Represents the combined properties of a `TypedRegExp` instance,  
 * including its detailed type information (`types`) and type-level flag properties.
 *
 * @template P - The pattern string of the RegExp.
 * @template F - The flags string of the RegExp.
 * @returns A type that combines `TypedRegExpTypes` and `TypedRegExpFlagPart`.
 * @internal
 */
export type TypedRegExpProperties<
  P extends string, F extends string = "",
> = [F] extends [never]
  ? CombineIntersection<{ types: never; } & TypedRegExpFlagPart<F>/*, {}*/>
  : CombineIntersection<{ types: TypedRegExpTypes<TypedRegExpCore<P, F>> } & TypedRegExpFlagPart<F>/*, {}*/>;
/*!
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//                      Primary Types
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/
/**
 * __`TypedRegExp` base type (core)__
 * 
 * + Can extend extra props from this type
 * 
 * @template P - The literal type of the regular expression pattern.
 * @template F - The literal type of the regular expression flags.
 * @property {P} source - The literal pattern string of the regular expression.
 * @property {F} flags - The literal flags string of the regular expression.
 * @internal
 */
export type TypedRegExpCore<P extends string, F extends string = ""> = RegExp & {
  readonly source: P;
  readonly flags: F;
} & TypedRegExpBrand;
/**
 * Represents a regular expression with enhanced type information,  
 * including literal types for its pattern and flags, and detailed types  
 * for its `exec` method results, named capture groups, and replacer functions.
 *
 * @template P - The literal type of the regular expression pattern.
 * @template F - The literal type of the regular expression flags.
 * 
 * @since 2025/12/24 12:27:39
 * @commit js-dev-tool@6ff89180acfb53c1a0bf9aebadfa12b210bfb3f8
 */
export type TypedRegExp<
  P extends string,
  F extends string = "",
> = TypedRegExpCore<P, F> & TypedRegExpProperties<P, F>;
/**
 * ### __`Type-only signature`__: no runtime implementation is provided.
 *
 * Creates a TypedRegExp type from a pattern and optional flags.
 *
 * @template P - The regex pattern (string literal).
 * @template F - The regex flags (string literal).
 * @param pattern The regex pattern.
 * @param flags Optional regex flags.
 * @see {@link TypedRegExp}
 */
export declare function createRegExp<
  const P extends string,
  const F extends string = ""
>(pattern: P, flags?: F): TypedRegExp<P, F>;
export {};