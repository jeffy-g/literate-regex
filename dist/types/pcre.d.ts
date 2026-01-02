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
 * @file types/pcre.d.ts
 */
/*! [2025/12/31 13:01:03]
 * ## Support PCRE-style regex source (type-level)
 *
 * @remarks
 * This module provides **type-level normalization** for "PCRE-ish" regex sources:
 * you can write a readable multi-line regex with indentation and `# ...` comments,
 * then derive a compact JavaScript `RegExp` source at compile time.
 *
 * Why type-level? Because it lets us:
 * - keep the regex readable in source code (with comments and formatting)
 * - ensure the normalized output is stable and verifiable (via type assertions)
 *
 * ## Supported rules
 * - `#` starts a comment and consumes the rest of the **current line**
 * - `\#` escapes `#` as a literal (comment is NOT started) and normalizes to `#`
 * - whitespace characters are removed during normalization
 * - newlines are normalized: `\r\n` and `\r` become `\n`
 *
 * ## Design note (ts(2589) survival)
 * Naively scanning the entire string character-by-character (multiple passes)
 * can hit TypeScript's instantiation depth limit (`ts(2589)`).
 * This implementation is **line-oriented**:
 * it strips each line, then concatenates results.
 * That tends to scale much better for long, commented regex sources.
 *
 * ## Non-goals (for now)
 * This is not a full PCRE parser. It intentionally focuses on comment + whitespace
 * normalization for readability and DX.
 */
/**
 * Union of whitespace characters used by this library.
 * 
 * + A set aligned with ECMAScript RegExp **`\s`** (WhiteSpace ∪ LineTerminator)
 * 
 * The union is used to normalize "PCRE-style" regex sources at the type level.
 * @internal
 */
type TWhiteSpace =
  | "\x09"
  | "\x0A"
  | "\x0B"
  | "\x0C"
  | "\x0D"
  | "\x20"
  | "\u00A0"
  | "\u1680"
  | "\u2000"
  | "\u2001"
  | "\u2002"
  | "\u2003"
  | "\u2004"
  | "\u2005"
  | "\u2006"
  | "\u2007"
  | "\u2008"
  | "\u2009"
  | "\u200A"
  | "\u2028" | "\u2029"
  | "\u202F" | "\u205F" | "\u3000"
  | "\uFEFF";
/**
 * Normalize newline sequences for line-based parsing.
 * 
 * + Align **`\r\n`** and **`\r`** to **`\n`** (makes splitting easier)
 *
 * @template S - Input string literal.
 * @returns A new string literal with `\r\n` and `\r` normalized to `\n`.
 * @internal
 *
 * @example
 * type X = NormalizeNewlines<"a\r\nb\rc\n">; // "a\nb\nc\n"
 */
type NormalizeNewlines<S extends string> =
  S extends `${infer A}\r\n${infer B}` ? NormalizeNewlines<`${A}\n${B}`> :
  S extends `${infer A}\r${infer B}` ? NormalizeNewlines<`${A}\n${B}`> :
  S;
/**
 * Strip and normalize a single line of a PCRE-style regex source.
 *
 * @remarks
 * Rules:
 * - `\#` is treated as a literal `#` (the backslash is dropped)
 * - an unescaped `#` starts a line comment and truncates the rest
 * - all whitespace characters are removed
 * - other escapes like `\s`, `\w`, `\/`, `\*` are preserved as-is
 *
 * @template S - One line of source (no `\n`).
 * @template Acc - Accumulator for the normalized output.
 *
 * @example
 * type A = StripLine<"  \\#\\w+   # comment  ">; // "#\\w+"
 * type B = StripLine<"  abc  # comment">;        // "abc"
 *
 * @internal
 *
 * @todo
 * - Handle `\\#` (a literal backslash + literal #) more strictly.
 * - Do not treat `#` as a comment starter inside character classes (`[...]`).
 */
type StripLine<S extends string, Acc extends string = ""> =
  S extends `\\#${infer Rest}`
    ? StripLine<Rest, `${Acc}#`>
    : S extends `\\${infer C}${infer Rest}`
      ? StripLine<Rest, `${Acc}\\${C}`>
      : S extends `#${string}`
        ? Acc
        : S extends `${infer C}${infer Rest}`
          ? C extends TWhiteSpace
            ? StripLine<Rest, Acc>
            : StripLine<Rest, `${Acc}${C}`>
          : Acc;
/**
 * Convert a multi-line PCRE-style regex source into a compact JS `RegExp.source`.
 *
 * @remarks
 * This type:
 * 1) normalizes newlines, 2) splits by line, 3) applies {@link StripLine},
 * then 4) concatenates the results.
 *
 * @template Input - A `const` string literal of the PCRE-ish source.
 * @template Acc - Accumulator for the result.
 * @template S - Internal normalized newline buffer (do not pass manually).
 *
 * @example
 * const RE_SOURCE = `
 * ^              # start
 * (?:\\#\\w+)     # keep literal "#"
 * ` as const;
 *
 * type Src = PCREStyleToJsRegExpSource<typeof RE_SOURCE>;
 * // "^(:?##\\w+)" ... (depending on your actual input)
 */
export type PCREStyleToJsRegExpSource<
  Input extends string,
  Acc extends string = "",
  S extends string = NormalizeNewlines<Input>,
> =
  S extends `${infer Line}\n${infer Rest}`
    ? PCREStyleToJsRegExpSource<Input, `${Acc}${StripLine<Line>}`, Rest>
    : `${Acc}${StripLine<S>}`;
export declare const normalizePCREStyleSource: <const S extends string>(src: S) => PCREStyleToJsRegExpSource<S>;
export {};