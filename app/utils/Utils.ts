import Env from '#start/env';
import { DateTime } from 'luxon';
import _ from 'lodash';
import { customAlphabet } from 'nanoid';
import dictionary from 'nanoid-dictionary';
import { Filter } from 'bad-words';
import BaseEnhancedModel from '#models/BaseEnhancedModel';
import { v4 as uuidV4 } from 'uuid';

/** bad-words filters for these words automatically:
 ** https://github.com/web-mech/badwords/blob/master/lib/lang.json
 ** Specify any additional "bad words" in this array: */
const blacklist: string[] = [];

const profanityFilter = new Filter();

if (blacklist.length) {
    profanityFilter.addWords(...blacklist);
}

export default class Utils {
    public static NUMERIC = /^[0-9]+$/;

    public static ALPHANUMERIC = /^[A-Za-z0-9]+$/;

    public static ALPHANUMERIC_WITH_SPACE = /^[A-Za-z0-9 ]+$/;

    public static ALPHABETS_WITH_OPTIONAL_SPACE_IN_BETWEEN = /^[a-zA-Z]+ ?[a-zA-Z]*$/;

    public static ALPHANUMERIC_WITH_OPTIONAL_HYPHEN_IN_BETWEEN = /^[a-zA-Z0-9\-]*$/;

    public static SPECIAL_CHARACTERS = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~\s]/;

    public static numberNanoId(size = 15): string {
        const nanoId = customAlphabet(dictionary.numbers, size);
        return nanoId();
    }

    public static uniqueString(length = 16): string {
        const stringNanoid = customAlphabet(
            dictionary.alphanumeric,
            length
        );

        return stringNanoid();
    }

    public static generateUuid(): string {
        return uuidV4();
    }

    public static random(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public static uniqueId(): number {
        return Number.parseInt(`${Date.now()}${Utils.random(111, 999)}`);
    }

    public static uniqueNanoId(): number {
        return Number.parseInt(Utils.numberNanoId());
    }

    public static async delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    public static isProduction(): boolean {
        return Env.get('NODE_ENV') === 'production';
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static isEmptyObject(object: Record<string, any>): boolean {
        return !Object.values(object).some((value) => {
            if (Array.isArray(value)) {
                return value.length > 0;
            }
            if (value && value.constructor === Object) {
                return Object.keys(value).length > 0;
            }
            return value !== undefined && value !== null && value !== '';
        });
    }

    public static toCamelCase(object: Record<string, unknown>): Record<string, unknown> {
        const transformed = _.transform(
            object,
            (result: Record<string, unknown>, value, key: string) => {
                result[_.camelCase(key)] = _.isObject(value)
                    ? Utils.toCamelCase(value as Record<string, unknown>)
                    : value;
            }
        );
        return transformed;
    }

    public static toSnakeCase(object: Record<string, unknown>): Record<string, unknown> {
        const transformed = _.transform(
            object,
            (result: Record<string, unknown>, value, key: string) => {
                result[_.snakeCase(key)] = _.isObject(value)
                    ? Utils.toSnakeCase(value as Record<string, unknown>)
                    : value;
            }
        );
        return transformed;
    }

    public static toBoolean(value: string | number | boolean): boolean {
        return ['1', 1, 'true', true].includes(value);
    }

    public static isValidJSONString(value: string): boolean {
        if (typeof value !== 'string') {
            return false;
        }
        try {
            const parsed = JSON.parse(value);
            return parsed && typeof parsed === 'object';
        } catch (error) {
            return false;
        }
    }

    public static getProgressBar(current: number, total: number): string {
        const percent = Math.floor((current / total) * 100);
        const completed = Math.ceil(percent / 3);
        const incomplete = Math.ceil((100 - percent) / 3);
        return `[${new Array(completed).join(
            '='
        )}${new Array(incomplete).join(
            ' '
        )}] ${percent}% :: ${current}/${total}`;
    }

    public static doesContainsSpecialCharsAndSpace(str: string): boolean {
        return this.SPECIAL_CHARACTERS.test(str);
    }

    public static toUTC(dateTime: DateTime): DateTime {
        return DateTime.fromISO(
            DateTime.fromISO(dateTime as unknown as string).toFormat('yyyy-LL-dd')
        ).toUTC();
    }

    public static ms(startTime: bigint, endTime: bigint): number {
        return Math.round(Number(endTime - startTime) / 1000000);
    }

    public static filterProfanity = (str: string): string => {
        return profanityFilter.clean(str);
    };

    public static filterObjStringsForProfanity<T extends { [key: string]: unknown } | BaseEnhancedModel>(
        obj: T
    ): T {
        const filtered: { [key: string]: unknown } = {};
        Object.entries(obj).forEach(([k, v]) => {
            filtered[k] = v;
            if (typeof v === 'string') {
                filtered[k] = this.filterProfanity(v);
            }
        });
        return filtered as T;
    };
}
