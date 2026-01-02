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
 * @file types/parser.d.ts
 */
import type { StringToUnion } from "./common.d.ts";
import type { TypedRegExp } from "./regex.d.ts";
import type { PCREStyleToJsRegExpSource } from "./pcre.d.ts";
/*!
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//                    Parse PCRE Style Regex Literal
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/
export type TRegexpFlag = "dgimsuvy";
export type TValidRegExpFlag = StringToUnion<TRegexpFlag> | "";
type StripFlagsFromEnd<S extends string, Acc extends string = ""> =
  S extends `${infer Rest}y` ? StripFlagsFromEnd<Rest, `y${Acc}`> :
  S extends `${infer Rest}v` ? StripFlagsFromEnd<Rest, `v${Acc}`> :
  S extends `${infer Rest}u` ? StripFlagsFromEnd<Rest, `u${Acc}`> :
  S extends `${infer Rest}s` ? StripFlagsFromEnd<Rest, `s${Acc}`> :
  S extends `${infer Rest}m` ? StripFlagsFromEnd<Rest, `m${Acc}`> :
  S extends `${infer Rest}i` ? StripFlagsFromEnd<Rest, `i${Acc}`> :
  S extends `${infer Rest}g` ? StripFlagsFromEnd<Rest, `g${Acc}`> :
  S extends `${infer Rest}d` ? StripFlagsFromEnd<Rest, `d${Acc}`> : { body: S; flags: Acc };
export type RegExpLiteralParts<L extends string> =
  StripFlagsFromEnd<L> extends { body: infer B extends string; flags: infer F extends string }
    ? B extends `/${infer AfterStart}`
      ? AfterStart extends `${infer Pattern}/`
        ? { pattern: Pattern; flags: F }
        : never
      : never
    : never;
export type PCREStyleRegExpParts<S extends string> = RegExpLiteralParts<PCREStyleToJsRegExpSource<S>>;
export type PCREStyleRegExpPattern<S extends string> = PCREStyleRegExpParts<S>["pattern"];
export type PCREStyleRegExpFlags<S extends string> = PCREStyleRegExpParts<S>["flags"];
export declare const extractJsRegexPartsFromPCREStyleRegExpLiteral: <const S extends string>(src: S) => PCREStyleRegExpParts<S>;
export declare const compilePCREStyleRegExpLiteral: <
  const S extends string,
  const This = TypedRegExp<PCREStyleRegExpPattern<S>, PCREStyleRegExpFlags<S>>
>(src: S) => This;
export {};