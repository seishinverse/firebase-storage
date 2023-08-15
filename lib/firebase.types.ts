import { Readable } from 'stream';

export interface IFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    stream: Readable;
    destination: string;
    filename: string;
    path: string;
    buffer: Buffer;
}

export interface IFirebaseStorageOptions {
    clientEmail: string,
    privateKey: string,
    projectId: string,
    expiration?: string,
    action?: 'read' | 'write' | 'delete' | 'resumable',
    ignoreNotFound?: boolean,
    gzip?: boolean
}
export type TFileNamePatterns = string | number | Date

export interface IStorageOptions {
    limits?: {
        size?: number | {
            min: number
            max: number
        }
        extensions: {
            include?: string[]
            exclude?: string[]
        } | '*'
    }
    naming?: {
        prefix?: TFileNamePatterns
        postfix?: TFileNamePatterns
        baseName?: boolean
        random?: boolean
        date?: boolean
        default?: boolean
    }
    include: {
        url: boolean
        key?: boolean
    }
}