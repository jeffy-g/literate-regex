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
 * @file types/captures.d.ts
 */
import type {
  TupleOf,
  IsEmptyRecord,
} from "./common.d.ts";
import type { RegExpSource } from "./regex.d.ts";
import type {
  RegExpFlags,
  HasStrictRegExpFlag,
} from "./regex-util.d.ts";
/*!
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//                            Named Capture Groups
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/
type FirstChar<S extends string> = S extends `${infer F}${infer _}` ? F : never;
/**
 * Recursively extracts parts that match the format (?<GroupName>...) from a string pattern,
 * without considering nesting, and unions them.
 * @template S - A string pattern.
 */
export type ExtractGroupNames<S extends unknown> =
  S extends `${infer _Before}(?<${infer Rest}`
    ? FirstChar<Rest> extends "=" | "!"
      ? ExtractGroupNames<Rest>
      : Rest extends `${infer GroupName}>${infer After}`
        ? GroupName extends ""
          ? "ExtractGroupNames: regex pattern error!"
          : GroupName | ExtractGroupNames<After>
        : never
    : never;
/**
 * Creates an object type with keys as the extracted group names and values as strings.
 * If no groups are found, it results in an empty object.
 * @template R - A RegExp type.
 * @date 2025/12/24 14:46:30 - It may be possible to extract the group name accurately (?)
 */
export type RegExpNamedGroups<R extends RegExp> =
  R extends RegExp & { readonly source: infer S extends string }
    ? ExtractGroupNames<S> extends infer K
      ? [K] extends [never]
        ? undefined
        : { [P in K & string]: string | undefined }
      : undefined
    : undefined;
/*!
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//                               Capture Groups
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/
/**
 * Preprocesses escape sequences in a string pattern by replacing escaped backslashes and characters.
 * 
 * + NOTE: This type is used to preprocess the pattern string before counting capture groups.
 * 
 * @template S - A string pattern.
 * @template Result - The resulting string after preprocessing. 
 * @internal
 */
export type __PreprocessEscapes<S extends string, Result extends string = ""> =
  S extends `\\\\${infer Rest}`
    ? __PreprocessEscapes<Rest, `${Result}__`>
    : S extends `\\${infer EscapedChar}${infer Rest}`
      ? __PreprocessEscapes<Rest, `${Result}_!`>
      : S extends `${infer Char}${infer Rest}`
        ? __PreprocessEscapes<Rest, `${Result}${Char}`>
        : Result;
/**
 * Counts the exact number of capture groups in a string pattern.
 * @template S - A string pattern.
 * @template Counter - An array used to count the capture groups.
 */
export type CountCaptureGroups<
  S extends string,
  Counter extends unknown[] = []
> =
  __PreprocessEscapes<S> extends `${infer _Before}(${infer Rest}`
    ? Rest extends `${"?:" | "?=" | "?!" | "?<=" | "?<!"}${infer After}`
      ? CountCaptureGroups<After, Counter>
      : CountCaptureGroups<Rest, [...Counter, unknown]>
    : Counter["length"];
/**
 * Builds a tuple type whose length equals the number of capture groups.
 * @template Count - Number of capture groups.
 * @template Result - Accumulator (internal).
 */
export type BuildCaptureTuple<
  Count extends number, ArrayType = string,
> = TupleOf<Count, ArrayType>;
export type CaptureOptTuple<N extends number, T = string | undefined> =
  N extends 0 ? [] :
  N extends 1 ? [$1: T] :
  N extends 2 ? [$1: T, $2: T] :
  N extends 3 ? [$1: T, $2: T, $3: T] :
  N extends 4 ? [$1: T, $2: T, $3: T, $4: T] :
  N extends 5 ? [$1: T, $2: T, $3: T, $4: T, $5: T] :
  N extends 6 ? [$1: T, $2: T, $3: T, $4: T, $5: T, $6: T] :
  N extends 7 ? [$1: T, $2: T, $3: T, $4: T, $5: T, $6: T, $7: T] :
  N extends 8 ? [$1: T, $2: T, $3: T, $4: T, $5: T, $6: T, $7: T, $8: T] :
  N extends 9 ? [$1: T, $2: T, $3: T, $4: T, $5: T, $6: T, $7: T, $8: T, $9: T] :
  N extends 10 ? [$1: T, $2: T, $3: T, $4: T, $5: T, $6: T, $7: T, $8: T, $9: T, $10: T] :
  N extends 11 ? [$1: T, $2: T, $3: T, $4: T, $5: T, $6: T, $7: T, $8: T, $9: T, $10: T, $11: T] :
  N extends 12 ? [$1: T, $2: T, $3: T, $4: T, $5: T, $6: T, $7: T, $8: T, $9: T, $10: T, $11: T, $12: T] :
  N extends 13 ? [$1: T, $2: T, $3: T, $4: T, $5: T, $6: T, $7: T, $8: T, $9: T, $10: T, $11: T, $12: T, $13: T] :
  N extends 14 ? [$1: T, $2: T, $3: T, $4: T, $5: T, $6: T, $7: T, $8: T, $9: T, $10: T, $11: T, $12: T, $13: T, $14: T] :
  N extends 15 ? [$1: T, $2: T, $3: T, $4: T, $5: T, $6: T, $7: T, $8: T, $9: T, $10: T, $11: T, $12: T, $13: T, $14: T, $15: T] :
  N extends 16 ? [$1: T, $2: T, $3: T, $4: T, $5: T, $6: T, $7: T, $8: T, $9: T, $10: T, $11: T, $12: T, $13: T, $14: T, $15: T, $16: T] :
  BuildCaptureTuple<N, T>;
/*!
// - - - - - - - - - - - - - - - - -
//         Indices (v0.4.0)
// - - - - - - - - - - - - - - - - -
*/
/**
 * @internal
 */
type TIndicesItem = [index: number, lastIndex: number];
/**
 * @internal
 */
type RegExpIndicesGroups<NamedGroups> = IsEmptyRecord<NamedGroups> extends true
  ? undefined
  : { [P in keyof NamedGroups & string]: TIndicesItem | undefined };
/**
 * @internal
 */
type RegExpIndicesTuple<GroupCount extends number> = [
  match: TIndicesItem,
  ...BuildCaptureTuple<GroupCount, TIndicesItem | undefined>
];
/**
 * 
 */
export type RegExpIndicesArray<GroupCount extends number, NamedGroups> = RegExpIndicesTuple<GroupCount> & {
  groups: RegExpIndicesGroups<NamedGroups>;
};
/**
 * @internal
 */
type RegExpExecArrayFixedBase<
  R extends RegExp,
  GroupCount extends number,
  NamedGroups,
  Tuple extends unknown[] = BuildCaptureTuple<GroupCount, string | undefined>
> = HasStrictRegExpFlag<RegExpFlags<R>, "d"> extends true
  ? [match: string, ...Tuple] & {
  groups: IsEmptyRecord<NamedGroups> extends true ? undefined : NamedGroups;
  index: number;
  input: string;
  indices: RegExpIndicesArray<GroupCount, NamedGroups>
} : [match: string, ...Tuple] & {
  groups: IsEmptyRecord<NamedGroups> extends true ? undefined : NamedGroups;
  index: number;
  input: string;
}
/**
 * Represents a fixed version of RegExpExecArray that includes the matched string,
 * captures, and optionally named groups.
 * @template R - A RegExp type.
 * @template S - The source string of the RegExp.
 * @template GroupCount - The number of capture groups.
 */
export type RegExpExecArrayFixed<
  R extends RegExp,
  S extends RegExpSource<R> = RegExpSource<R>,
  GroupCount extends number = CountCaptureGroups<S>,
  NamedGroups = RegExpNamedGroups<R>
> = RegExpExecArrayFixedBase<R, GroupCount, NamedGroups>;
export type RegExpExecArrayFixedPretty<
  R extends RegExp,
  S extends RegExpSource<R> = RegExpSource<R>,
  GroupCount extends number = CountCaptureGroups<S>,
  NamedGroups = RegExpNamedGroups<R>
> = RegExpExecArrayFixedBase<R, GroupCount, NamedGroups, CaptureOptTuple<GroupCount>>;
export {};