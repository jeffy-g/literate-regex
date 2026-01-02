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
 * @file literate-regex/global.d.ts
 */
import type {
  TypedRegExp,
  StringReplacerFunction,
  RegExpExecArrayFixedPretty,
} from "./index.d.ts";
declare global {
  interface RegExp {
    /**
     * Executes a search on a string using a regular expression pattern, and returns an array containing the results of that search.
     * @template {string} P
     * @template {string} F
     * @param {TypedRegExp<P, F>} this The regular expression object.
     * @param {string} str The String object or string literal on which to perform the search.
     * @returns {RegExpExecArrayFixedPretty< this > | null} An array of results or null if no match is found.
     */
    exec<const P extends string, const F extends string = "">(this: TypedRegExp<P, F>, str: string): RegExpExecArrayFixedPretty< this > | null;
  }
  interface String {
    /**
     * Replaces occurrences of a pattern in the string with a specified replacement.
     * @template {RegExp | string} SV
     * @param searchValue A regular expression object.
     * @param replaceValue A string or a function to create the new substring.
     */
    replace<SV extends RegExp | string>(this: string, searchValue: SV, replaceValue: StringReplacerFunction<SV>): string;
  }
  interface RegExpConstructor {
    /**
     * Creates a typed RegExp object with literal types for the pattern and flags.
     * @template {string} P
     * @template {string} F
     * @param {P} pattern The regular expression pattern.
     * @param {F} [flags] The flags for the regular expression.
     * @returns {TypedRegExp<P, F>} A typed RegExp object.
     */
    new <const P extends string, const F extends string = "">(pattern: P, flags?: F): TypedRegExp<P, F>;
    /**
     * Creates a typed RegExp object with literal types for the pattern and flags.
     * @template {string} P
     * @template {string} F
     * @param {P} pattern The regular expression pattern.
     * @param {F} [flags] The flags for the regular expression.
     * @returns {TypedRegExp<P, F>} A typed RegExp object.
     */
    <const P extends string, const F extends string = "">(pattern: P, flags?: F): TypedRegExp<P, F>;
    readonly prototype: RegExp;
  }
}
export {};